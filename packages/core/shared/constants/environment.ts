import { isRunningInExpoGo } from "expo";
import Constants, { ExecutionEnvironment } from "expo-constants";

export const isExpoGo = isRunningInExpoGo();
export const isProductionBuild = Constants.executionEnvironment === ExecutionEnvironment.Standalone;
export const isBareWorkflow = Constants.executionEnvironment === ExecutionEnvironment.Bare;
