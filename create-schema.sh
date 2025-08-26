#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to display help
show_help() {
    echo -e "${BLUE}Usage: ./create-schema.sh --type TYPE --name NAME${NC}"
    echo ""
    echo -e "${YELLOW}Options:${NC}"
    echo "  --type    Schema type (object, document, page)"
    echo "  --name    Schema name (camelCase)"
    echo ""
    echo -e "${YELLOW}Examples:${NC}"
    echo "  ./create-schema.sh --type object --name testimonial"
    echo "  ./create-schema.sh --type document --name product"
    echo "  ./create-schema.sh --type page --name contact"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --type)
            TYPE="$2"
            shift 2
            ;;
        --name)
            NAME="$2"
            shift 2
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            show_help
            exit 1
            ;;
    esac
done

# Validate required arguments
if [[ -z "$TYPE" || -z "$NAME" ]]; then
    echo -e "${RED}Error: Both --type and --name are required${NC}"
    show_help
    exit 1
fi

# Validate type
if [[ "$TYPE" != "object" && "$TYPE" != "document" && "$TYPE" != "page" ]]; then
    echo -e "${RED}Error: --type must be one of: object, document, page${NC}"
    exit 1
fi

# Function to convert camelCase to PascalCase
toPascalCase() {
    local input="$1"
    # Get first character and rest of string
    local first="${input:0:1}"
    local rest="${input:1}"
    # Convert first char to uppercase and concatenate
    echo "$(echo "$first" | tr '[:lower:]' '[:upper:]')$rest"
}

# Convert name to different cases
PASCAL_CASE=$(toPascalCase "$NAME")
UPPER_CASE=$(echo "$NAME" | tr '[:lower:]' '[:upper:]')
KEBAB_CASE=$(echo "$NAME" | sed 's/\([A-Z]\)/-\L\1/g' | sed 's/^-//')

echo -e "${BLUE}Creating schema for: ${GREEN}$NAME${NC} (type: ${GREEN}$TYPE${NC})"
echo ""

# Define paths based on type
case $TYPE in
    "object")
        SCHEMA_DIR="sanity/schema/objects"
        SCHEMA_FILE="${SCHEMA_DIR}/${NAME}.studio.ts"
        INTERFACE_DIR="lib/sanity/types"
        INTERFACE_FILE="${INTERFACE_DIR}/I${PASCAL_CASE}.ts"
        QUERY_DIR="lib/sanity/queries/fragments"
        QUERY_FILE="${QUERY_DIR}/${NAME}.ts"
        ;;
    "document")
        SCHEMA_DIR="sanity/schema/documents"
        SCHEMA_FILE="${SCHEMA_DIR}/${NAME}.studio.ts"
        INTERFACE_DIR="lib/sanity/types"
        INTERFACE_FILE="${INTERFACE_DIR}/I${PASCAL_CASE}.ts"
        QUERY_DIR="lib/sanity/queries/fragments"
        QUERY_FILE="${QUERY_DIR}/${NAME}.ts"
        ;;
    "page")
        SCHEMA_DIR="sanity/schema/pages"
        SCHEMA_FILE="${SCHEMA_DIR}/${NAME}.studio.ts"
        INTERFACE_DIR="lib/sanity/types/pages"
        INTERFACE_FILE="${INTERFACE_DIR}/I${PASCAL_CASE}.ts"
        QUERY_DIR="lib/sanity/queries/pages"
        QUERY_FILE="${QUERY_DIR}/${NAME}.ts"
        ;;
esac

# Create directories if they don't exist
mkdir -p "$SCHEMA_DIR"
mkdir -p "$INTERFACE_DIR"
mkdir -p "$QUERY_DIR"

# Generate schema content based on type
case $TYPE in
    "object")
        cat > "$SCHEMA_FILE" << EOF
import { defineType } from 'sanity';

export const ${NAME}Type = defineType({
  name: '${NAME}',
  title: '${PASCAL_CASE}',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
  ],
});
EOF
        ;;
    "document")
        cat > "$SCHEMA_FILE" << EOF
import { defineType } from 'sanity';

export const ${NAME}Type = defineType({
  name: '${NAME}',
  title: '${PASCAL_CASE}',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
});
EOF
        ;;
    "page")
        cat > "$SCHEMA_FILE" << EOF
// Studio-only
import { definePage } from '../documents/page.studio';

export const ${NAME}Type = definePage({
  name: '${NAME}',
  title: '${PASCAL_CASE}',
  fields: [
    {
      name: 'content',
      title: 'Content',
      type: 'object',
      options: {
        collapsible: true,
      },
      fields: [
        { name: 'title', title: 'Title', type: 'string' },
      ],
    },
  ],
});
EOF
        ;;
esac

# Generate interface content
case $TYPE in
    "object"|"document")
        cat > "$INTERFACE_FILE" << EOF
export interface I${PASCAL_CASE} {
  title: string;
};
EOF
        ;;
    "page")
        cat > "$INTERFACE_FILE" << EOF
import { IPageSettings } from '../config/IPageSettings';

export interface I${PASCAL_CASE} extends IPageSettings {
  content: {
    title?: string;
  };
}
EOF
        ;;
esac

# Generate query content
case $TYPE in
    "object"|"document")
        cat > "$QUERY_FILE" << EOF
import groq from 'groq';

export const GROQ${PASCAL_CASE}Query = groq\`
  title,
\`;
EOF
        ;;
    "page")
        cat > "$QUERY_FILE" << EOF
import groq from 'groq';
import { GROQPageSettingsQuery } from '../fragments/pageSettings';

export const GROQ${PASCAL_CASE}Query = groq\`
  *[_type == "${NAME}" && _id == \$id][0]{
  \${GROQPageSettingsQuery},
    content {
      title,
      description,
    }
  }
\`;
EOF
        ;;
esac

# Display success messages
echo -e "${GREEN}✓ Created schema:${NC} $SCHEMA_FILE"
echo -e "${GREEN}✓ Created interface:${NC} $INTERFACE_FILE"
echo -e "${GREEN}✓ Created query:${NC} $QUERY_FILE"
echo ""

# Function to add line to file if not already present
add_line_if_not_exists() {
    local file="$1"
    local line="$2"
    local search_pattern="$3"
    
    if ! grep -q "$search_pattern" "$file" 2>/dev/null; then
        echo "$line" >> "$file"
        return 0
    else
        return 1
    fi
}

# Function to add import after specific line
add_import_after() {
    local file="$1"
    local import_line="$2"
    local after_pattern="$3"
    local check_pattern="$4"
    
    if ! grep -q "$check_pattern" "$file" 2>/dev/null; then
        sed -i "" "/$after_pattern/a\\
$import_line" "$file"
        return 0
    else
        return 1
    fi
}

# Automatic integration
echo -e "${YELLOW}🔧 Integrating into project...${NC}"

case $TYPE in
    "object"|"document")
        # Add to schema index
        SCHEMA_INDEX="sanity/schema/index.ts"
        
        if [[ "$TYPE" == "object" ]]; then
            IMPORT_LINE="import { ${NAME}Type } from './objects/${NAME}.studio';"
            # Add import and export
            if add_import_after "$SCHEMA_INDEX" "$IMPORT_LINE" "import.*buttonType.*objects" "${NAME}Type"; then
                sed -i "" "/buttonType,/a\\
  ${NAME}Type," "$SCHEMA_INDEX"
            fi
        else
            IMPORT_LINE="import { ${NAME}Type } from './documents/${NAME}.studio';"
            # Add import and export  
            if add_import_after "$SCHEMA_INDEX" "$IMPORT_LINE" "import.*callToActionType.*documents" "${NAME}Type"; then
                sed -i "" "/callToActionType,/a\\
  ${NAME}Type," "$SCHEMA_INDEX"
            fi
        fi
        
        echo -e "${GREEN}✓ Added to schema index${NC}"
        ;;
        
    "page")
        # 1. Add to pages index
        PAGES_INDEX="sanity/schema/pages/index.studio.ts"
        IMPORT_LINE="import { ${NAME}Type } from './${NAME}.studio';"
        
        if add_import_after "$PAGES_INDEX" "$IMPORT_LINE" "import.*pageLegalType" "${NAME}Type"; then
            # Add to array
            sed -i "" "s/pageLegalType]/pageLegalType, ${NAME}Type]/" "$PAGES_INDEX"
            echo -e "${GREEN}✓ Updated pages index${NC}"
        else
            echo -e "${YELLOW}⚠ Already exists in pages index${NC}"
        fi
        
        # 2. Add to routing
        ROUTING_FILE="lib/routing/pageTypes.ts"
        
        # Add query import
        QUERY_IMPORT="import { GROQ${PASCAL_CASE}Query } from '../sanity/queries/pages/${NAME}';"
        add_import_after "$ROUTING_FILE" "$QUERY_IMPORT" "import.*GROQPageLegalQuery" "GROQ${PASCAL_CASE}Query"
        
        # Add component import
        COMPONENT_IMPORT="import Page${PASCAL_CASE} from '@/components/pages/Page${PASCAL_CASE}';"
        add_import_after "$ROUTING_FILE" "$COMPONENT_IMPORT" "import PageLegal" "Page${PASCAL_CASE}"
        
        # Add to arrays if imports were added
        if grep -q "GROQ${PASCAL_CASE}Query" "$ROUTING_FILE"; then
            # Add to AVAILABLE_PAGE_TYPES
            sed -i "" "s/'pageLegal',/'pageLegal',\\
  '${NAME}',/" "$ROUTING_FILE"
            
            # Add to PageTypeMap
            sed -i "" "/pageLegal: { query: GROQPageLegalQuery, component: PageLegal },/a\\
  ${NAME}: { query: GROQ${PASCAL_CASE}Query, component: Page${PASCAL_CASE} }," "$ROUTING_FILE"
            
            echo -e "${GREEN}✓ Updated routing${NC}"
        else
            echo -e "${YELLOW}⚠ Already exists in routing${NC}"
        fi
        
        # 3. Create component
        COMPONENT_DIR="components/pages"
        COMPONENT_FILE="${COMPONENT_DIR}/Page${PASCAL_CASE}.tsx"
        
        mkdir -p "$COMPONENT_DIR"
        
        if [[ ! -f "$COMPONENT_FILE" ]]; then
            cat > "$COMPONENT_FILE" << EOF
import { I${PASCAL_CASE} } from '@/lib/sanity/types/pages/I${PASCAL_CASE}';

export default function Page${PASCAL_CASE}({ data }: { data: I${PASCAL_CASE} }) {
  return (
    <div>
      <h1>{data?.settings?.title}</h1>
      {data?.content?.title && <h2>{data.content.title}</h2>}
    </div>
  );
}
EOF
            echo -e "${GREEN}✓ Created page component${NC}"
        else
            echo -e "${YELLOW}⚠ Component already exists${NC}"
        fi
        ;;
esac

echo ""

# Success message
echo -e "${YELLOW}📋 Next steps:${NC}"
echo ""

case $TYPE in
    "object"|"document")
        echo -e "${BLUE}✅ Schema automatically integrated!${NC}"
        echo -e "${GREEN}   • Added to sanity/schema/index.ts${NC}"
        echo -e "${GREEN}   • Ready to use in other schemas${NC}"
        ;;
    "page")
        echo -e "${BLUE}✅ Page automatically integrated!${NC}"
        echo -e "${GREEN}   • Added to pages index and routing${NC}"
        echo -e "${GREEN}   • Component created${NC}"
        echo ""
        echo -e "${YELLOW}Manual steps:${NC}"
        echo -e "${BLUE}   1. Create page in Sanity Studio with type '${NAME}'${NC}"
        echo -e "${BLUE}   2. Set desired slug in page settings${NC}"
        echo -e "${BLUE}   3. Now access your page and happy coding!${NC}"
        ;;
esac

echo ""
echo -e "${GREEN}🎉 Schema creation completed successfully!${NC}"
echo -e "${BLUE}All files have been generated and integrated automatically.${NC}"
