import { Form } from 'antd';
import clearInput from 'assets/header/clearInput.svg';
import { useState } from 'react';
import { mergeParam } from 'utils/helper';
import { CommonButton } from 'components/CommonButton';
import { initFilter } from 'constant';
import { SearchIcon } from 'components/icons';

export type SearchComponentProps = {
  currentFilter: any;
  location: any;
  history: any;
};

export const SearchInput = ({ currentFilter, location, history }: SearchComponentProps) => {
  const [keyword, setKeyword] = useState<string>('');

  const handleChangeKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setKeyword(value);
    if (!value) {
      clearInputHandler();
    }
  };

  const handleSearchByKeyWord = () => {
    const newUrl = mergeParam(location.pathname, { ...currentFilter, page: initFilter.page, keyWord: keyword });
    history.push(newUrl);
  };

  const clearInputHandler = () => {
    setKeyword('');
    const newUrl = mergeParam(location.pathname, { ...currentFilter, page: initFilter.page, keyWord: '' });
    history.push(newUrl);
  };
  return (
    <Form>
      <Form.Item>
        <div className="search-input-admin flex item-center">
          <div className="flex item-center mr-2">
            <SearchIcon className="flex mr-1-5" />
            <input
              maxLength={200}
              placeholder="Username, email, phone number"
              type="text"
              className="mr-1-5"
              onChange={handleChangeKeyword}
              value={keyword}
            />
          </div>
          <div className="flex item-center">
            {keyword && <img src={clearInput} className="clear-input-admin" alt="" onClick={clearInputHandler} />}
            <CommonButton htmlType="submit" style={{ marginLeft: '14px' }} onClick={handleSearchByKeyWord} size="small">
              Search
            </CommonButton>
          </div>
        </div>
      </Form.Item>
    </Form>
  );
};
