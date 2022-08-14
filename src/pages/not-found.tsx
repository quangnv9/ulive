import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button type="primary" size="small">
            <Link to="/user/buyer">Back to home</Link>
          </Button>
        }
      />
    </div>
  );
}
