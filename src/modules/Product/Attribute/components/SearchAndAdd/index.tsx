import { CommonButton } from 'components/CommonButton';
import { SearchInput } from './SearchInput';
import { useHistory, useLocation } from 'react-router';
import { useParseParams } from 'hooks/use-params';
import { AddIcon } from 'components/icons/AddIcon';
import './index.scss';
import { useState } from 'react';
import { message, Modal, Form, Row } from 'antd';
import { StatusSelect, TextInput } from 'components/form-control';
import { attributeStatus } from '../attribute.const';
import { useAttributeCreate } from '../../attribute.queries';

type CreateAttributeValue = {
  name?: string;
  status: string;
};

export const SearchAndAdd = () => {
  const history = useHistory();
  const location = useLocation();
  const currentCondition = useParseParams();
  const [visibleOpenAddNewAttribute, setVisibleOpenAddAttribute] = useState<boolean>(false);

  const [form] = Form.useForm();
  const { mutate: createAttribute } = useAttributeCreate();

  const handleOkConfirmModal = (values: CreateAttributeValue) => {
    const { name, status } = values;
    const editName = name?.trim();
    if (editName?.length === 0) {
      form.setFields([
        {
          name: 'name',
          errors: ['This field is required'],
        },
      ]);
      return;
    }
    if (values) {
      createAttribute(
        {
          name: name?.trim(),
          status,
        },
        {
          onSuccess: (res) => {
            message.success({
              content: 'Create successfully',
              className: 'custom-class',
              style: {
                textAlign: 'right',
              },
            });
            history.push('/product/attribute');
            setVisibleOpenAddAttribute(false);
            form.setFieldsValue({
              name: '',
              status: attributeStatus[0],
            });
          },
          onError: (errors: any) => {
            if (errors) {
              form.setFields([
                {
                  name: 'name',
                  errors: [errors.message],
                },
              ]);
            }
          },
        },
      );
    }
  };

  const cancelCreateAttributeModal = () => {
    setVisibleOpenAddAttribute(false);
    form.setFieldsValue({
      name: '',
      status: attributeStatus[0],
    });
  };

  return (
    <div className="tools-container__admin">
      <div className="tools-container-admin__left">
        <div className="mr-2">
          <SearchInput currentFilter={currentCondition} location={location} history={history} />
        </div>
      </div>
      <CommonButton onClick={() => setVisibleOpenAddAttribute(true)} icon={<AddIcon className="mr-1-5" />}>
        Add Attribute
      </CommonButton>
      <Modal
        className="add-new-attribute-modal"
        closable={false}
        title="Add New Attribute"
        centered
        width={400}
        visible={visibleOpenAddNewAttribute}
        footer={null}
      >
        <Form form={form} onFinish={handleOkConfirmModal}>
          <TextInput maxLength={20} placeholder="Text input" label="Name" name="name" />
          <StatusSelect
            options={attributeStatus as []}
            initialValue={attributeStatus[0]}
            name="status"
            label="Status"
          />
          <Row justify="end">
            <Form.Item>
              <div className="flex confirm-buttom-attribute-modal">
                <CommonButton variant="default" customWidth={true} onClick={cancelCreateAttributeModal}>
                  Cancel
                </CommonButton>
                <CommonButton customWidth={true} htmlType="submit">
                  Save
                </CommonButton>
              </div>
            </Form.Item>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};
