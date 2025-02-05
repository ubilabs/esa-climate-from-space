import { useDispatch } from "react-redux";
import { ThunkDispatch } from "../components/main/app/create-redux-store";

export const useThunkDispatch: () => ThunkDispatch = useDispatch;
