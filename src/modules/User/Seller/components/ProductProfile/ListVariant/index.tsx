import { Table } from 'antd';
import { formatterNumber } from 'utils/helper';
export function ListVariant(props: any) {
  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      width: '5%',
      align: 'center' as 'center',
    },
    {
      title: 'Variant Name',
      dataIndex: 'name',
      width: '35%',
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      width: '15%',
      align: 'center' as 'center',
      render: (sku: string) => <span>#{sku}</span>,
    },
    {
      title: 'Price',
      dataIndex: 'originPrice',
      width: '15%',
      align: 'center' as 'center',
      render: (originPrice: string) => {
        return originPrice ? <span>{formatterNumber(originPrice)}</span> : <span>0</span>;
      },
    },
    {
      title: 'Discount Price',
      dataIndex: 'discountPrice',
      width: '15%',
      align: 'center' as 'center',
      render: (discountPrice: string) => {
        return discountPrice ? <span>{formatterNumber(discountPrice)}</span> : <span>&nbsp;</span>;
      },
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      width: '15%',
      align: 'center' as 'center',
      render: (quantity: string) => {
        return quantity ? <span>{quantity}</span> : <span>0</span>;
      },
    },
  ];

  return (
    <div className="basic-info-wrapper">
      <span className="title-basic-info">Variant</span>
      <div className="table-paging">
        <Table dataSource={props.detailVariant} columns={columns} pagination={false} />
      </div>
    </div>
  );
}
