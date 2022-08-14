import { Col, Form, Row, Select } from 'antd';

interface extraProps {
  detailOPtionAttribute: any;
}
export const OptionAttribute = (props: extraProps) => {
  const [optionForm] = Form.useForm();
  const { detailOPtionAttribute } = props;
  const options = detailOPtionAttribute
    ? detailOPtionAttribute.map((item: { _id: any; name: any; values: any }) => ({
        id: item._id,
        name: item.name,
        option: item.values,
      }))
    : [
        {
          id: null,
          name: '',
          option: [],
        },
      ];
  return (
    <>
      <div className="option-wrapper">
        <Form form={optionForm}>
          {options.map((item: { name: any; option: any; id: any }, index: number) => (
            <Row gutter={24}>
              <Col span={5}>
                <Form.Item labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} label={`Name ${index + 1}`}>
                  <Select
                    disabled
                    defaultValue={item.name}
                    className="attribute-select-status"
                    showArrow={false}
                  ></Select>
                </Form.Item>
              </Col>
              <Col span={19}>
                <Form.Item
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  label={`Option ${index + 1}`}
                  name="tag"
                  className="option-tag"
                >
                  <Select
                    mode="multiple"
                    disabled
                    style={{ width: '100%' }}
                    placeholder="Please select"
                    defaultValue={item.option}
                  ></Select>
                </Form.Item>
              </Col>
            </Row>
          ))}
        </Form>
      </div>
    </>
  );
};
