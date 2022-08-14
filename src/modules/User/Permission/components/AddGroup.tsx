import { Col, Form, message, Row } from 'antd';
import { CommonButton } from 'components/CommonButton';
import { StatusSelect, TextArea, TextInput } from 'components/form-control';
import { ConfirmModal } from 'components/modal';
import { useState } from 'react';
import { useHistory } from 'react-router';
import { onlyLettersNumbersUnderscoresPeriods } from 'regex';
import { formatListPermission } from 'utils/array';
import { groupPermissionStatus } from '../permission.const';
import { useAllPerMissionQuery, useCreateGroupPermission } from '../permission.queries';
import { PermissionResourcePattern, PermissionResourcePatternProps } from './PermissionResourcePattern';

type ValueGroupToCreate = {
  name: string;
  description: string | null | undefined;
  permissions: Array<string>;
  status: string;
};
export function AddGroupPage() {
  const [form] = Form.useForm();
  const history = useHistory();
  const [loadingSave, setLoadingSave] = useState<boolean>(false);
  const [listPermission, setListPermission] = useState<any>({});
  const [visibleModalConfirmGoBack, setVisibleModalConfirmGoBack] = useState<boolean>(false);
  const { data } = useAllPerMissionQuery();
  const { mutate: createGroup } = useCreateGroupPermission();

  const handleCreateGroup = (values: ValueGroupToCreate) => {
    const mapPermission = Object.values(listPermission).reduce((total, cur) => {
      return [...(total as Array<string>), ...(cur as Array<string>)];
    });
    if (!(mapPermission as Array<string>).length) {
      message.error({
        content: 'Please choose at least one permission',
        className: 'custom-class',
        style: {
          textAlign: 'right',
        },
      });
      return;
    }
    const { description, name, status } = values;
    const newGroup = {
      name: name,
      status: status,
      permissions: mapPermission,
      ...(description ? { description: description } : {}),
    };
    setLoadingSave(true);
    createGroup(newGroup, {
      onSuccess: () => {
        setLoadingSave(false);
        history.push('/user/permission');
        message.success({
          content: 'Create successfully',
          className: 'custom-class',
          style: {
            textAlign: 'right',
          },
        });
      },
      onError: (errors: any) => {
        setLoadingSave(false);
        message.error({
          content: errors.message,
          className: 'custom-class',
          style: {
            textAlign: 'right',
          },
        });
      },
    });
  };

  const handleCancelCreate = () => {
    history.push('/user/permission');
  };
  return (
    <div className="container-detail">
      <Row>
        <Col lg={22} offset={1}>
          <Form className="form-input" autoComplete="off" form={form} onFinish={handleCreateGroup}>
            <Row gutter={[30, 15]}>
              <Col span={12}>
                <TextInput
                  placeholder="Text input"
                  label="Group Name"
                  name="name"
                  rules={[
                    { required: true, message: 'This field is required' },
                    {
                      pattern: new RegExp('^[_A-z0-9;./_:]{3,40}$'),
                      message: 'Group name must be between 3-40 characters with no space',
                    },
                    {
                      pattern: new RegExp(onlyLettersNumbersUnderscoresPeriods),
                      message: 'Group name only use letters, numbers, underscores and periods',
                    },
                  ]}
                />
                <StatusSelect
                  showArrow={true}
                  name="status"
                  label="Status"
                  initialValue={groupPermissionStatus[0]}
                  options={groupPermissionStatus as []}
                />
              </Col>
              <Col span={12}>
                <TextArea
                  rules={[{ max: 200, message: 'Description must be 0-200 characters' }]}
                  label="Description"
                  name="description"
                  autoSize={{ minRows: 5, maxRows: 5 }}
                  placeholder="Type description here"
                />
              </Col>
            </Row>
            <Row>
              {data &&
                formatListPermission(data).map((item: PermissionResourcePatternProps) => (
                  <Col span={6}>
                    <PermissionResourcePattern permission={item} setListPermission={setListPermission} />
                  </Col>
                ))}
            </Row>
            <Row>
              <Col span={12} />
              <Col span={12}>
                <Form.Item className="btn-wrapper">
                  <>
                    <div className="mr-3">
                      <CommonButton
                        space="space-medium"
                        size="middle"
                        variant="default"
                        onClick={() => setVisibleModalConfirmGoBack(true)}
                      >
                        Cancel
                      </CommonButton>
                    </div>
                    <CommonButton
                      space="space-medium"
                      size="middle"
                      variant="primary"
                      htmlType="submit"
                      loading={loadingSave}
                    >
                      Save
                    </CommonButton>
                  </>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
      <ConfirmModal
        visible={visibleModalConfirmGoBack}
        cancelText="No"
        okText="Yes"
        onCancel={() => setVisibleModalConfirmGoBack(false)}
        onOk={handleCancelCreate}
      >
        Are you sure to go back without saving?
      </ConfirmModal>
    </div>
  );
}
