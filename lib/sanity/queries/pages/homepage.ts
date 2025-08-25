import groq from 'groq';
import { GROQPageSettingsQuery } from '../fragments/pageSettings';
import { GROQCallToActionQuery } from '../fragments/callToAction';

export const GROQHomepageQuery = groq`
  *[_type == "homepage" && _id == $id][0]{
    ${GROQPageSettingsQuery},
    hero{ 
      title, 
      description,
      button->{${GROQCallToActionQuery}}
    },

    intro{ 
      title, 
      description 
    }
  }
`;
