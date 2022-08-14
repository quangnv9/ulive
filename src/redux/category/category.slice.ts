import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'redux/store';
import { categoryApi } from 'services/api-category.service';
import { Category, ParentStatus } from 'types';
import { listToTree } from 'utils/helper';
import { categoryLevel } from './../../modules/Product/Category/category.const';

export const getListCategories = createAsyncThunk('category/getListCategories', async () =>
  categoryApi.getAllCategory(),
);

type Status = 'pending' | 'done' | 'error';
type CategoryState = {
  listCategories: Array<Category>;
  listSearchCate: Array<Category>;
  loading: boolean;
  status: Status;
  isEditCategory: boolean;
  firstLoading: boolean;
};

type SearchCate = {
  dataList: Category[];
  expandedKeys: string[];
  searchValue: string;
};
const initialState: CategoryState = {
  listCategories: [],
  loading: false,
  status: 'pending',
  listSearchCate: [],
  isEditCategory: false,
  firstLoading: false,
};
export const formatDataList = (data: Category[], parentStatus = []): Array<Category> => {
  //@ts-ignore
  return data.map((item) => {
    const _level = !item.path
      ? categoryLevel.Level01
      : item.path.split('/').length === 1
      ? categoryLevel.Level02
      : categoryLevel.Level03;
    //@ts-ignore
    let _status: Array<ParentStatus> = [{ status: item.status, level: _level, name: item.name }];
    if (item.children) {
      //@ts-ignore
      _status = [...parentStatus, { status: item.status, level: _level, name: item.name }];
    }
    return {
      ...item,
      key: item._id,
      value: item._id,
      children: item.children && formatDataList(item.children, _status as any),
      level: _level,
      hasChildren: item.children.length ? true : formatDataList(item.children),
      parentStatus: _status,
    };
  });
};

export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    searchCate(state, action: PayloadAction<SearchCate>) {
      const { searchValue, dataList, expandedKeys } = action.payload;
      const listSearchResult = dataList.map((item: Category) => {
        if (item.title.toUpperCase().indexOf(searchValue.toUpperCase()) > -1) {
          return item;
        }
        return null;
      });

      const listSearchResultKeys = listSearchResult
        .map((item: Category | null) => item?._id)
        .filter((item: string | undefined) => item !== undefined);

      const finalDataNotTree = dataList
        .filter((item: Category) => {
          if (expandedKeys?.includes(item?._id) || listSearchResultKeys?.includes(item?._id)) {
            return item;
          }
          return null;
        })
        .map((item: Category) => {
          return {
            hasChildren: item.hasChildren,
            key: item.key,
            level: item.level,
            name: item.name,
            parentStatus: item.parentStatus,
            path: item.path,
            status: item.status,
            title: item.title,
            value: item.value,
            _id: item._id,
          };
        });

      const searchResult = listToTree(finalDataNotTree as [], null, null);
      state.listSearchCate = searchResult;
    },
    editCateOrNot(state) {
      state.isEditCategory = true;
    },
  },
  extraReducers: {
    [getListCategories.pending.toString()]: (state) => {
      const { firstLoading } = state;
      state.loading = true;
      state.status = 'pending';
      state.firstLoading = firstLoading ? false : true;
    },
    [getListCategories.fulfilled.toString()]: (state, action: PayloadAction<Category[]>) => {
      const listCateResponse = [...action.payload];
      const newListCate = formatDataList(listCateResponse);
      state.loading = false;
      state.listCategories = newListCate;
      state.status = 'done';
      state.firstLoading = true;
    },
    [getListCategories.rejected.toString()]: (state) => {
      state.loading = false;
      state.status = 'error';
      state.firstLoading = false;
    },
  },
});

// actions
export const categoryActions = categorySlice.actions;

// reducers
export const categoryReducer = categorySlice.reducer;

// selectors
export const selectCategoryList = (state: RootState) => state.category.listCategories;
export const selectStatusGetCategoryList = (state: RootState) => state.category.status;
export const selectListSearchCate = (state: RootState) => state.category.listSearchCate;
export const selectIsEditCateOrNot = (state: RootState) => state.category.isEditCategory;
export const selectFirstLoading = (state: RootState) => state.category.firstLoading;
