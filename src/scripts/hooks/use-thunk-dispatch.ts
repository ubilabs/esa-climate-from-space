import { useDispatch } from "react-redux";
import { AppThunkDispatch } from "../components/main/app/create-redux-store";

export const useThunkDispatch: () => AppThunkDispatch = useDispatch;
