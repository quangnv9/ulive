/* eslint-disable indent */
import { Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import attributesStyle from './attribute.module.scss';
import { formatterNumber, formatterNumberWithoutDecimal } from 'utils/helper';

export function PriceInventoryForm(props: { basePriceInventory?: any }) {
  const [formPriceInventory] = Form.useForm();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (props.basePriceInventory) {
      formPriceInventory.setFieldsValue({
        originPrice: formatterNumber(props.basePriceInventory.originPrice),
        discountPrice: formatterNumber(props.basePriceInventory.discountPrice),
        sku: props.basePriceInventory.sku,
        quantity: formatterNumberWithoutDecimal(props.basePriceInventory.quantity),
      });
    }
  }, [formPriceInventory, props.basePriceInventory]);

  return (
    <>
      <Form form={formPriceInventory}>
        <Row gutter={16}>
          <Col span={12}>
            <div className={attributesStyle.priceInventoryForm}>
              <Col className="title-basic-info" span={24}>
                Price
              </Col>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    label="Original Price*"
                    name="originPrice"
                  >
                    <Input placeholder="€0.00" disabled className={attributesStyle.formInputWrapper} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    label="Discount Price"
                    name="discountPrice"
                  >
                    <Input placeholder="€0.00" disabled className={attributesStyle.formInputWrapper} />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Col>
          <Col span={12}>
            <div className={attributesStyle.priceInventoryForm}>
              <Col className="title-basic-info" span={24}>
                Inventory
              </Col>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} label="SKU#" name="sku" className="sku">
                    <Input placeholder="#" disabled className={attributesStyle.formInputWrapper} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} label="Quantity*" name="quantity">
                    <Input placeholder="0.00" disabled className={attributesStyle.formInputWrapper} />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Form>
    </>
  );
}
