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
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
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
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
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
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  landParcelImage?: string;
  /** @wixFieldType text */
  structureDetails?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  structureDetailsImage?: string;
  /** @wixFieldType text */
  unitConfiguration?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  unitConfigurationImage?: string;
  /** @wixFieldType text */
  openSpacePercentage?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  openSpacePercentageImage?: string;
  /** @wixFieldType text */
  vaastuCompliance?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  vaastuComplianceImage?: string;
  /** @wixFieldType text */
  privacyFeature?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  privacyFeatureImage?: string;
  /** @wixFieldType text */
  densityType?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  densityTypeImage?: string;
}
