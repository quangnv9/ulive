import { Card, Switch } from 'antd';

import { useState } from 'react';
import './styles.scss';
interface DescriptionItem {
  description: string;
  status: string;
  _id: string;
  action: string;
}

export interface PermissionResourcePatternProps {
  resource: string;
  description: Array<DescriptionItem>;
}
export interface Props {
  permission: PermissionResourcePatternProps;
  detailListPerMission?: Array<string>;
  setListPermission: React.Dispatch<React.SetStateAction<string[]>>;
  block?: boolean;
}
export const PermissionResourcePattern = (props: Props) => {
  const { permission, detailListPerMission, block } = props;
  const exitsPermission = detailListPerMission
    ? permission.description.filter((val) => detailListPerMission.includes(val._id)).map((item) => item._id)
    : [];
  const [listRender, setListRender] = useState<any>({ [permission.resource]: exitsPermission });

  /**
   * Handle when choose each item from all resource to select permission
   * @param id
   * @param resource
   * @param checked
   */
  const [checkViewItem, setcheckViewItem] = useState(false);
  const handleSelectPermission = (id: string, resource: string, checked: boolean) => {
    const checkViewITem = permission.description.find((i) => i._id === id);
    let idView;
    if (checkViewITem?.action.includes('view')) {
      setcheckViewItem(false);
    }
    if (checkViewITem?.action.includes('edit') || checkViewITem?.action.includes('delete')) {
      setcheckViewItem(true);
      idView = permission.description.find((i) => i.action.includes('view'));
    }
    const condition = listRender && listRender[permission.resource].includes(id);
    const result = {
      [resource]: condition
        ? listRender[resource].filter((item: string) => item !== id)
        : checked && [...listRender[resource], id, idView && idView._id],
    };
    setListRender(() => result);
    props.setListPermission((pre) => ({ ...pre, ...result }));
  };
  /**
   * Handle data when choose all item from each resource, to select all permission of resource
   * @param resource
   * @param checked
   */
  const handleSelectResource = (resource: string, checked: boolean) => {
    const result = {
      [resource]: checked ? permission.description.map((item) => item._id) : [],
    };

    setListRender(() => result);
    props.setListPermission((pre) => ({ ...pre, ...result }));
  };

  // useEffect(() => {
  //   if (detailListPerMission) {
  //     const isExitsPermission = permission.description.filter((val) => detailListPerMission.includes(val._id));

  //     setListRender({ [permission.resource]: isExitsPermission.map((item) => item._id) });
  //   } else {
  //     setListRender({ [permission.resource]: [] });
  //   }
  // }, [detailListPerMission, permission.description, permission.resource]);

  return (
    <div className="permisson-resource">
      <Card
        title={permission.resource === 'dashboard' ? permission.resource : `${permission.resource} management`}
        extra={
          <Switch
            disabled={block}
            checked={listRender && listRender[permission.resource]?.length && true}
            onChange={(checked: boolean) => handleSelectResource(permission.resource, checked)}
          />
        }
      >
        {permission.description.map((item) => (
          <div className="permission-item">
            <p>{item.description}</p>
            <Switch
              disabled={block}
              checked={
                (item.action.includes('view') && checkViewItem) ||
                (listRender && listRender[permission.resource].includes(item._id))
              }
              onChange={(checked: boolean) => handleSelectPermission(item._id, permission.resource, checked)}
            />
          </div>
        ))}
      </Card>
    </div>
  );
};
