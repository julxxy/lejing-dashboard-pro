import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'

function NoPermission() {
  const navigate = useNavigate()
  const navigateToHome = () => {
    navigate('/')
  }
  return (
    <>
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you do not have permission to access this page."
        extra={
          <Button type="primary" onClick={navigateToHome}>
            Back Home
          </Button>
        }
      />
    </>
  )
}

export default NoPermission
