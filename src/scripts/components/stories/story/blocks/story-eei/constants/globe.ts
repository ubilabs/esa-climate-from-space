export enum Layers {
  EEI_NO_MASK = "eei_no_mask",
  EEI_WATER_MASK = "eei_water_mask",
  EEI_LAND_MASK = "eei_land_mask",
  EEI_ICE_MASK = "eei_ice_mask",
  EEI_ATMOSPHERE_MASK = "eei_atmosphere_mask",
}

export const ATMOSPHERE_MASK_RENDER_OPTIONS = {
  atmosphereStrength: 1.8,
  atmosphereColor: [0.5961, 0.8588, 0.8078],
};
