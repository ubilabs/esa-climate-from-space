import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LayerList } from "../../types/layer-list";
import { DetailsById } from "./details";

interface LayersState {
  layerList: LayerList;
  details: DetailsById;
  layerIds: string[];
}

const parseUrl = () => {
  // Dummy implementation for parseUrl, replace with actual logic
  return { layerIds: { mainId: "fire.burned_area", compareId: null } };
};

const initialState: LayersState = {
  layerList: [
    {
      id: "fire.burned_area",
      type: "Biosphere",
      name: "Zone brûlée par le feu",
      shortName: "Feu",
      usageInfo: "© ESA",
      description:
        "Tout au long de l'histoire, l'homme a utilisé le feu comme outil de gestion de l'environnement. Les caractéristiques de la végétation, principalement les charges de biomasse et l'humidité, déterminent le comportement du feu, mais le feu modifie également la structure et l'évolution de la végétation. Le climat influe sur la fréquence des incendies par le biais des cycles thermiques et des précipitations, mais il est également affecté par les incendies, en particulier par les émissions de gaz et de particules. Cette influence mutuelle entre la végétation, le climat et les incendies souligne l'importance de disposer d'informations mondiales à long terme sur les superficies brûlées comme données d'entrée pour les modélisateurs du climat et de la végétation.\r\n\r\nActuellement, le produit CCI Fire comprend 19 années de données sur les surfaces brûlées à l'échelle mondiale. Le produit est proposé à une résolution de 250 m avec la date de détection de l'incendie et le type de couverture terrestre qui a été brûlé, et a des cellules d'un quart de degré avec le total des surfaces brûlées par cellule de la grille, le total des surfaces brûlées par type de couverture terrestre, et la surface observée. Dans les deux cas, des couches d'incertitude sont également fournies.\n\n**Variable affichée:** Surface totale brûlée en mètres carrés\r\n\n**Période de temps : ** Janvier 2001 - Décembre 2020\r\n\n**Résolution temporelle:** mensuelle\r\n\n**Etendue géographique:** mondiale\r\n\n**Résolution spatiale : ** 0,25 x 0,25 degré\r\n\n**Version : ** 5.1\r\n\n**DOI:** [10.5285/3628cb2fdba443588155e15dee8e5352](http://dx.doi.org/10.5285/3628cb2fdba443588155e15dee8e5352)\r\n\r\n[Site web du projet CCI Fire ECV de l'ESA] (https://climate.esa.int/projects/fire/)  \r\n[Données dans le portail de données ouvertes](https://catalogue.ceda.ac.uk/uuid/3628cb2fdba443588155e15dee8e5352)",
    },
  ],
  details: {},
  layerIds: parseUrl()?.layerIds || [],
};

const layersSlice = createSlice({
  name: "layers",
  initialState,
  reducers: {
    setLayerList: (state, action: PayloadAction<LayerList>) => {
      state.layerList = action.payload.map((layer) => ({ ...layer }));
    },
    setLayerDetails: (state, action: PayloadAction<DetailsById>) => {
      state.details = { ...action.payload };
    },
    setSelectedLayerIds: (
      state,
      action: PayloadAction<{ layerId: string | null; isPrimary: boolean }>,
    ) => {
      const newState = { ...state };

      console.log("🚀 ~ newState:", newState);
      const key = action.payload.isPrimary ? "mainId" : "compareId";
      newState.layerIds[key] = action.layerId;
      return newState;
    },
  },
});

export const { setLayerList, setLayerDetails, setSelectedLayerIds } =
  layersSlice.actions;

export default layersSlice.reducer;
export type { LayersState };
