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
$(if [[ "$TYPE" == "document" ]]; then
  echo "  slug: { current: string };"
fi)
}
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
$(if [[ "$TYPE" == "document" ]]; then
  echo '  "slug": slug.current,'
fi)
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

# Generate instructions for manual steps
echo -e "${YELLOW}📋 Manual steps required:${NC}"
echo ""

case $TYPE in
    "object")
        echo -e "${BLUE}1. Add to schema index:${NC}"
        echo "   Edit: sanity/schema/index.ts"
        echo "   Add: import { ${NAME}Type } from './objects/${NAME}.studio';"
        echo "   Add: ${NAME}Type to the types array"
        ;;
    "document")
        echo -e "${BLUE}1. Add to schema index:${NC}"
        echo "   Edit: sanity/schema/index.ts"
        echo "   Add: import { ${NAME}Type } from './documents/${NAME}.studio';"
        echo "   Add: ${NAME}Type to the types array"
        ;;
    "page")
        echo -e "${BLUE}1. Add to pages index:${NC}"
        echo "   Edit: sanity/schema/pages/index.studio.ts"
        echo "   Add: import { ${NAME}Type } from './${NAME}.studio';"
        echo "   Add: ${NAME}Type to AvailablePages array"
        echo ""
        echo -e "${BLUE}2. Add to page routing:${NC}"
        echo "   Edit: lib/routing/pageTypes.ts"
        echo "   Add: import { ${NAME}Query } from '../sanity/queries/pages/${NAME}';"
        echo "   Add: import { Page${PASCAL_CASE} } from '../../components/pages/Page${PASCAL_CASE}';"
        echo "   Add: '${NAME}': { query: ${NAME}Query, component: Page${PASCAL_CASE} } to PageTypeMap"
        echo ""
        echo -e "${BLUE}3. Create page component:${NC}"
        echo "   Create: components/pages/Page${PASCAL_CASE}.tsx"
        ;;
esac

echo ""
echo -e "${GREEN}🎉 Schema creation completed!${NC}"
echo -e "${BLUE}Remember to restart your development server after making the manual changes.${NC}"
