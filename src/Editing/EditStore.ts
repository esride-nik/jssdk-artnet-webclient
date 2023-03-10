import Graphic from "@arcgis/core/Graphic";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Editor from "@arcgis/core/widgets/Editor";
import { makeObservable, observable } from "mobx";
import AppStore from "../Stores/AppStore";
import { CustomEditTools, StepId } from "./types";

class EditStore {
  public activeCustomEditTool: CustomEditTools = "Off";
  public unsavedEditsAvailable: boolean = true;
  public readonly customCommitCallbacks: ((editor: Editor) => Promise<void>)[] =
    [];
  public editorWorkflowStep: StepId = undefined;
  public editorFeature: Graphic | undefined = undefined;
  private readonly appStore: AppStore;

  constructor(appStore: AppStore) {
    this.appStore = appStore;
    makeObservable(this, {
      activeCustomEditTool: observable,
      unsavedEditsAvailable: observable,
      editorWorkflowStep: observable,
    });
  }

  // transparent fill with thin turquoise outline
  get sketchSymbol(): __esri.SimpleFillSymbol {
    return {
      type: "simple-fill",
      color: [0, 0, 0, 0],
      style: "solid",
      outline: {
        color: "#08fcfc",
        width: 1,
      },
    } as unknown as __esri.SimpleFillSymbol;
  }

  public readonly getActionButtonClassName = (
    toolName: CustomEditTools
  ): string => {
    let cssClasses =
      this.activeCustomEditTool === toolName && this.isToolEnabled(toolName)
        ? "activeTool"
        : "";
    switch (toolName) {
      case "Copy":
        cssClasses += " esri-icon-duplicate";
        break;
      case "DrawUnion":
        cssClasses += " esri-icon-up";
        break;
      case "DrawDifference":
        cssClasses += " esri-icon-down";
        break;
      case "ConvexHull":
        cssClasses += " esri-icon-feature-layer";
        break;
      case "CloseHoles":
        cssClasses += " esri-icon-radio-checked";
        break;
      default:
        cssClasses += " esri-icon-deny";
        break;
    }
    return cssClasses;
  };

  get editFeatureIsPolygon(): boolean {
    return this.editorFeature?.geometry?.type === "polygon";
  }

  get editLayer(): FeatureLayer | undefined {
    return this.editorFeature?.layer as FeatureLayer;
  }

  get editLayerId(): string | undefined {
    return this.editorFeature?.layer.id;
  }

  get isEditingExistingFeature(): boolean {
    return this.editorWorkflowStep === "editing-existing-feature";
  }

  public isToolEnabled(toolName: CustomEditTools): boolean {
    console.debug(`${toolName} enabled`);
    // return this.isEditingExistingFeature && this.editFeatureIsPolygon && this.editorWorkflowStep === 'editing-existing-feature';
    switch (toolName) {
      case "Copy":
        return (
          this.isEditingExistingFeature &&
          this.editFeatureIsPolygon &&
          this.editorWorkflowStep === "editing-existing-feature"
        );
      case "DrawUnion":
        return (
          this.isEditingExistingFeature &&
          this.editFeatureIsPolygon &&
          this.editorWorkflowStep === "editing-existing-feature"
        );
      case "DrawDifference":
        return (
          this.isEditingExistingFeature &&
          this.editFeatureIsPolygon &&
          this.editorWorkflowStep === "editing-existing-feature"
        );
      case "ConvexHull":
        return (
          this.isEditingExistingFeature &&
          this.editFeatureIsPolygon &&
          this.editorWorkflowStep === "editing-existing-feature"
        );
      case "CloseHoles":
        return (
          this.isEditingExistingFeature &&
          this.editFeatureIsPolygon &&
          this.editorWorkflowStep === "editing-existing-feature"
        );
      default:
        return true;
    }
  }

  public addCustomCommitCallback(
    callback: (editor: Editor) => Promise<void>
  ): void {
    this.customCommitCallbacks.push(callback);
  }
}

export default EditStore;
