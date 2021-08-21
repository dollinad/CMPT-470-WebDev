// my-dashboard-component.jsx
import { Box, Button } from '@admin-bro/design-system'

const Dashboard = () => {

  return (
    <Box variant="grey">
    <Box variant="white">
        <h1>Welcome, Admin!</h1>
        <br></br>
        <p>Click button to start verifying users:</p>
        <br></br>
        <a href ="/admin/resources/User"><Button>Review Users</Button></a>      
      </Box>
    </Box>
  )
}

export default Dashboard