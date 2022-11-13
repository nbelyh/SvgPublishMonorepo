import { ViewType } from "./FileBrowser.types";
import { IFile } from "../../../../services/FileBrowserService.types";
import { IColumn } from '@fluentui/react/lib/DetailsList';
import { IFilePickerResult } from "../../FilePicker.types";

export enum LoadingState {
  idle = 1,
  loading = 2,
  loadingNextPage
}

export interface IFileBrowserState {
  // isLoading: boolean;
  // isLoadingNextPage: boolean;
  loadingState: LoadingState;
  items: IFile[];
  nextPageQueryString: string;
  // currentPath: string;
  filePickerResult: IFilePickerResult;
  columns: IColumn[];
  selectedView: ViewType;
}
