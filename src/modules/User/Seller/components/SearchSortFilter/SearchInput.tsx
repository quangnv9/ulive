import React, { useState } from 'react';
import clearInput from 'assets/header/clearInput.svg';
import { Form } from 'antd';
import { mergeParam } from 'utils/helper';
import { initFilter } from 'constant';
import { CommonButton } from 'components/CommonButton';
import { SearchIcon } from 'components/icons';

export type SearchComponentProps = {
  currentFilter: any;
  history: any;
  location: any;
};
export const SearchComponent = ({ currentFilter, history, location }: SearchComponentProps) => {
  const [keyword, setKeyword] = useState<string>(currentFilter.content);
  const handleChangeKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setKeyword(value);
    if (!value) {
      clearInputHandler();
    }
  };

  const handleSearchByKeyWord = () => {
    const newUrl = mergeParam(location.pathname, { ...currentFilter, page: initFilter.page, content: keyword });
    history.push(newUrl);
  };

  const clearInputHandler = () => {
    setKeyword('');
    const newUrl = mergeParam(location.pathname, { ...currentFilter, page: initFilter.page, content: '' });
    history.push(newUrl);
  };

  return (
    <Form>
      <Form.Item>
        <div className="search-input flex item-center">
          <div className="flex item-center mr-2">
            <SearchIcon className="flex mr-1-5" />
            <input
              maxLength={200}
              onChange={handleChangeKeyword}
              placeholder="Shop name, email, phone number"
              className="mr-1-5"
              type="text"
              value={keyword}
            />
          </div>
          <div className="flex item-center ">
            {keyword && (
              <img className="clear-input mr-1-5 cursor-pointer " onClick={clearInputHandler} src={clearInput} alt="" />
            )}
            <CommonButton
              htmlType="submit"
              loading={false}
              className="search-button"
              onClick={handleSearchByKeyWord}
              size="small"
            >
              Search
            </CommonButton>
          </div>
        </div>
      </Form.Item>
    </Form>
  );
};
