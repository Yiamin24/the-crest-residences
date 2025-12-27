/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: clubhouseamenities
 * Interface for ClubhouseAmenities
 */
export interface ClubhouseAmenities {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  amenityName?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType image */
  image?: string;
  /** @wixFieldType text */
  category?: string;
  /** @wixFieldType boolean */
  isAvailable24_7?: boolean;
}


/**
 * Collection ID: locationhighlights
 * Interface for LocationHighlights
 */
export interface LocationHighlights {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  locationName?: string;
  /** @wixFieldType text */
  category?: string;
  /** @wixFieldType number */
  distanceValue?: number;
  /** @wixFieldType text */
  distanceUnit?: string;
  /** @wixFieldType text */
  areaOrLocality?: string;
  /** @wixFieldType url */
  mapUrl?: string;
}


/**
 * Collection ID: outdooramenities
 * Interface for OutdoorAmenities
 */
export interface OutdoorAmenities {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  amenityName?: string;
  /** @wixFieldType text */
  category?: string;
  /** @wixFieldType image */
  amenityImage?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType boolean */
  isFeatured?: boolean;
}


/**
 * Collection ID: projecthighlights
 * Interface for ProjectHighlights
 */
export interface ProjectHighlights {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  landParcel?: string;
  /** @wixFieldType image */
  landParcelImage?: string;
  /** @wixFieldType text */
  structureDetails?: string;
  /** @wixFieldType image */
  structureDetailsImage?: string;
  /** @wixFieldType text */
  unitConfiguration?: string;
  /** @wixFieldType image */
  unitConfigurationImage?: string;
  /** @wixFieldType text */
  openSpacePercentage?: string;
  /** @wixFieldType image */
  openSpacePercentageImage?: string;
  /** @wixFieldType text */
  vaastuCompliance?: string;
  /** @wixFieldType image */
  vaastuComplianceImage?: string;
  /** @wixFieldType text */
  privacyFeature?: string;
  /** @wixFieldType image */
  privacyFeatureImage?: string;
  /** @wixFieldType text */
  densityType?: string;
  /** @wixFieldType image */
  densityTypeImage?: string;
}
