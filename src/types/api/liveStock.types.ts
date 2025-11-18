// Type for an individual image
type Image = {
  url: string;
};

// Type for a data item
export type LiveStockListingItem = {
  id: string;
  scientific_name: string;
  name: string;
  images?: Image[];
  primaryImage?: string;
};

// Type for pagination link
export type PaginationLink = {
  url: string | null;
  label: string;
  active: boolean;
};

// Type for facet category counts
export type FacetCategory = {
  [key: string]: number;
};

// Type for facet construction
export type FacetConstruction = {
  definition: string;
  type: string;
  label: string;
};

export type SortableConstruction = {
  definition: string;
  label: string;
};

// Type for the root structure
export type LiveStockListingApiResponse = {
  data: LiveStockListingItem[];
  links: PaginationLink[];
  facets: {
    care_level: FacetCategory;
    diet: FacetCategory;
    fish_type_family: FacetCategory;
    fish_type_family_common: FacetCategory;
    reef_safe: FacetCategory;
  };
  facetConstruction: FacetConstruction[];
  sortableConstruction: SortableConstruction[];
  total: number;
  firstItem: number;
  lastIme: number;
  totalShowing: number;
  hasMore: boolean;
};
