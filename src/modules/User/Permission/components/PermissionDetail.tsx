import { Col, Form, message, Row } from 'antd';
import { CommonButton } from 'components/CommonButton';
import { StatusSelect, TextArea, TextInput } from 'components/form-control';
import { EditGroupIcon } from 'components/icons';
import { LoadingComponent } from 'components/LoadingComponent';
import { ConfirmModal } from 'components/modal';
import { useParseParams } from 'hooks/use-params';
import { useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { onlyLettersNumbersUnderscoresPeriods } from 'regex';
import { formatListPermission } from 'utils/array';
import { groupPermissionStatus } from '../permission.const';
import { useAllPerMissionQuery, useGetGroupPermission, useUpdateGroupPerMission } from '../permission.queries';
import './per.scss';
import { PermissionResourcePattern, PermissionResourcePatternProps } from './PermissionResourcePattern';

type PermissionDetailParam = {
  permissionId: string;
};
type ValueGroupPermissionToUpdate = {
  name: string;
  description: string | null | undefined;
  permissions: Array<string>;
  status: string;
};

export function PermissionDetailPage() {
  const { permissionId } = useParams<PermissionDetailParam>();
  const { data, isLoading } = useGetGroupPermission(permissionId);
  const defaultListPermission = useAllPerMissionQuery().data;
  const [loadingSave, setLoadingSave] = useState<boolean>(false);
  const [isOpenModalConfirmCancleEdit, setIsOpenModalConfirmCancleEdit] = useState<boolean>(false);
  const [listPermission, setListPermission] = useState<any>({});
  const [form] = Form.useForm();
  const { action } = useParseParams();
  const location = useLocation();
  const history = useHistory();
  const onModalOkEdit = () => {
    setIsOpenModalConfirmCancleEdit(false);
    history.push(location.pathname);
  };
  const handleCancelEdit = () => {
    setIsOpenModalConfirmCancleEdit(true);
  };
  const handleOnEditGroup = () => {
    history.push(`${location.pathname}?action=edit`);
  };

  const { mutate: saveGroupPermission } = useUpdateGroupPerMission();
  const handleSaveGroup = (values: ValueGroupPermissionToUpdate) => {
    const mapPermission = Object.values(listPermission).reduce((total, cur) => {
      return [...(total as Array<string>), ...(cur as Array<string>)];
    });

    const updatePermission = Array.from(
      new Set([...(mapPermission as Array<string>), ...(data?.permissions as [string])]),
    );
    if (!updatePermission.length) {
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
    const newGroupValues = {
      _id: permissionId,
      name: name,
      status: status,
      ...(description ? { description: description } : { ...(data?.description ? { description: '' } : {}) }),
      permissions: updatePermission,
    };
    setLoadingSave(true);
    saveGroupPermission(newGroupValues, {
      onSuccess: () => {
        setLoadingSave(false);
        history.push('/user/permission');
        message.success({
          content: 'Edit successfully',
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
  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        name: data?.name,
        description: data?.description,
        status: data?.status,
      });
    }
  }, [data, form]);
  if (isLoading) {
    return <LoadingComponent size="large" />;
  }

  return (
    <div className="container-detail">
      <Row>
        <Col lg={22} offset={1}>
          <Form className="form-input" autoComplete="off" form={form} onFinish={handleSaveGroup}>
            {action ? (
              <Row gutter={[30, 15]}>
                <Col span={12}>
                  <TextInput
                    placeholder="Text input"
                    label="Group Name"
                    name="name"
                    disabled={!action}
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
                    disabled={!action}
                    showArrow={!!action}
                    name="status"
                    label="Status"
                    options={groupPermissionStatus as []}
                  />
                </Col>
                <Col span={12}>
                  <TextArea
                    rules={[{ max: 200, message: 'Description must be 0-200 characters' }]}
                    label="Description"
                    name="description"
                    autoSize={{ minRows: 5, maxRows: 5 }}
                  />
                </Col>
              </Row>
            ) : (
              <Row>
                <Col span={12}>
                  <div className="group-detail">
                    <p className="group-detail-name">
                      {data?.name}
                      <span className={data?.status === 'Active' ? 'group-active-status' : 'group-inactive-status'}>
                        {data?.status}
                      </span>
                    </p>
                    <p>{data?.description}</p>
                  </div>
                </Col>
              </Row>
            )}

            <Row>
              {defaultListPermission &&
                formatListPermission(defaultListPermission).map((item: PermissionResourcePatternProps) => (
                  <Col span={6}>
                    <PermissionResourcePattern
                      block={!action}
                      permission={item}
                      setListPermission={setListPermission}
                      detailListPerMission={data?.permissions}
                    />
                  </Col>
                ))}
            </Row>
            <Row>
              <Col span={12} />
              <Col span={12}>
                <Form.Item className="btn-wrapper">
                  {!action ? (
                    <CommonButton
                      onClick={handleOnEditGroup}
                      size="middle"
                      variant="primary"
                      icon={<EditGroupIcon className="mr-1-5" />}
                    >
                      Edit Group
                    </CommonButton>
                  ) : (
                    <>
                      <div className="mr-3">
                        <CommonButton space="space-medium" size="middle" variant="default" onClick={handleCancelEdit}>
                          Cancel
                        </CommonButton>
                      </div>
                      <CommonButton space="space-medium" size="middle" htmlType="submit" loading={loadingSave}>
                        Save
                      </CommonButton>
                    </>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
      <ConfirmModal
        visible={isOpenModalConfirmCancleEdit}
        onOk={onModalOkEdit}
        onCancel={() => setIsOpenModalConfirmCancleEdit(false)}
        cancelText="No"
        okText="Yes"
      >
        Are you sure to cancel changing?
      </ConfirmModal>
    </div>
  );
}
