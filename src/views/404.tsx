import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'

function PageNotFound() {
  const navigate = useNavigate()
  const navigateToHome = () => {
    navigate('/')
  }
  return (
    <>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button type="primary" onClick={navigateToHome}>
            Back Home
          </Button>
        }
      />
    </>
  )
}

export default PageNotFound
