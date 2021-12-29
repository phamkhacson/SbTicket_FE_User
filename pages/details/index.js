import Layout from "../../components/Layout";
import {
  Row,
  Col,
  Card,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Button,
  Spin
} from "antd";
import Swal from "sweetalert2";
import { dec } from "../../utils/encdec";
import { postBookSeat } from "../../actions/book";
import { login, getCustomerDetail, register, updateCustomer } from "../../actions/customer";
const { Option } = Select;
import moment from "moment";

class Details extends React.Component {
  state = {
    dataSource: [],
    name: "",
    nationalId: "",
    dob: "",
    email: "",
    address: "",
    isLoggedin: false,
    isRegistering: false,
    username: "",
    password: "",
    confirmPassword: "",
    customerId: null,
    isEditingInfo: false,
    checkLoading: false
  };

  componentDidMount() {
    const customerId = localStorage.getItem("customerId");
    if (customerId) {
      this.fetchCustomerData(customerId)
      this.setState({
        isLoggedin: true,
        customerId
      })
    }
  }

  componentDidUpdate(prevState) {
    if (prevState.customerId !== this.state.customerId) {

    }
  }

  fetchCustomerData = async (id) => {
    const resp = await getCustomerDetail(id)
    this.setState({
      name: resp.body.fullName,
      nationalId: resp.body.cmt,
      dob: resp.body.birthDay,
      email: resp.body.email,
      address: resp.body.address
    })
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleEditInfo = async () => {
    const { customerId, name, nationalId, dob, email, address, isEditingInfo } = this.state
    if(!isEditingInfo){
      this.setState({
        isEditingInfo: true
      })
      return
    }
    const resp = await updateCustomer(customerId, {
      fullName: name,
      address,
      cmt: nationalId,
      birthDay: dob,
      email: email
    });
    this.fetchCustomerData(customerId)
    if (resp.status === 200) {
      this.sweetAlert("success", `Updated successfully`)
      this.setState({
        isRegistering: false
      });
    } else {
      this.sweetAlert("error");
    }
    this.setState({
      isEditingInfo: false
    })
  }

  handleSubmit = async () => {
    const { customerId } = this.state;
    const { seat, tripBusId } = this.props;
    const info = { 
      tripBusId,
      customerId: parseInt(customerId),
      seatBooked: seat
     };
     this.setState({
      checkLoading: true
    })
    const resp = await postBookSeat(info);
    if (resp.status === 200) {
      this.setState({
        checkLoading: false
      })
      this.sweetAlert("success", `Thank you for your booking! Your seat number is ${seat}`)
    } else if (resp.status === 403) {
      this.setState({
        checkLoading: false
      })
      this.sweetAlert("error", resp.msg);
    } else {
      this.setState({
        checkLoading: false
      })
      this.sweetAlert("error");
    }
  };

  handleLogin = async () => {
    const { username, password } = this.state
    const resp = await login({
      username,
      password
    });
    if (resp.status === 200) {
      this.sweetAlert("success", `Logged in as ${username}`)
      localStorage.setItem("customerId", resp.customerId)
      this.setState({
        isLoggedin: true,
        customerId: resp.customerId
      });
      this.fetchCustomerData(resp.customerId)
    } else {
      this.sweetAlert("error");
    }
  }

  handleRegister = async () => {
    const { username, password, confirmPassword, name, nationalId, address, dob, email } = this.state
    if (password !== confirmPassword) {
      this.sweetAlert("error", "Password not match")
    } else {
      const resp = await register({
        userName: username,
        passWord: password,
        fullName: name,
        cmt: nationalId,
        address,
        birthDay: dob,
        email: email
      })
      if (resp.status === 200) {
        this.sweetAlert("success", `Please log in`)
        this.setState({
          isRegistering: false
        });
      } else {
        this.sweetAlert("error");
      }
    }
  }

  onChangeDate = val => {
    const journeyDate = val && moment(val._d).format("YYYY-MM-DD");
    this.setState({
      dob: journeyDate
    })
  };

  sweetAlert = (status, message) => {
    // setTimeout(() => {
    //   if (status !== "error") {
    //     Router.push("/");
    //   }
    // }, 1000);

    if (status === "error") {
      return Swal.fire({
        icon: "error",
        title: "Oops...",
        text: message || "Something went wrong!"
      });
    } else {
      Swal.fire("Congrats!", message, "success");
    }
  };

  render() {
    const { isLoggedin, isRegistering, name, nationalId, dob, email, address, isEditingInfo } = this.state;
    return (
      <Layout>
        <Row className="row-container">
          <Col span={4}></Col>
          <Col span={8}>
            {isLoggedin && (
              <Card title="Passengers Details" style={{ width: "100%" }}>
                <Input.Group>
                  <h4>Passenger Name:</h4>
                  <Input
                    onChange={this.handleChange}
                    name="name"
                    value={name}
                    disabled={!isEditingInfo}
                  />
                </Input.Group>
                <br />
                <Input.Group>
                  <h4>National ID:</h4>
                  <Input
                    onChange={this.handleChange}
                    name="nationalId"
                    value={nationalId}
                    disabled={!isEditingInfo}
                  />
                </Input.Group>
                <br />
                <Input.Group>
                    <h4>Email:</h4>
                    <Input
                      onChange={this.handleChange}
                      name="email"
                      value={email}
                    />
                  </Input.Group>
                  <br />
                <Input.Group>
                  <h4>Current Address:</h4>
                  <Input
                    onChange={this.handleChange}
                    name="address"
                    value={address}
                    disabled={!isEditingInfo}
                  />
                </Input.Group>
                <br />
                <Input.Group>
                  <h4>Date Of Birth: </h4>
                  {
                    dob ? <DatePicker
                      style={{ width: "100%" }}
                      format="YYYY-MM-DD"
                      onChange={this.onChangeDate}
                      value={moment(dob)}
                      disabled={!isEditingInfo}
                    /> :
                      <DatePicker
                        style={{ width: "100%" }}
                        format="YYYY-MM-DD"
                        onChange={this.onChangeDate}
                        disabled={!isEditingInfo}
                      />
                  }
                </Input.Group>

                <br />
                <Button
                  type="primary"
                  style={{ width: "100%" }}
                  onClick={this.handleEditInfo}
                >
                  {isEditingInfo ? `Update` : `Change information`}
                </Button>

                <br /><br />
                <Button
                  type="primary"
                  style={{ width: "100%" }}
                  onClick={this.handleSubmit}
                >
                  {console.log(this.state.checkLoading)}
                  {
                    
                    this.state.checkLoading ?  <Spin /> : `Proceed to Confirmation `
                  }
                </Button>
                <br /><br />
                <h5 style={{ textAlign: "center" }}>
                  <a
                    style={{ color: "#1890ff" }}
                    onClick={() => {
                      localStorage.removeItem('customerId')
                      this.setState({
                        customerId: null,
                        isLoggedin: false
                      })
                    }}
                  >Log in as another user</a>
                </h5>
              </Card>
            )}
            {
              !isLoggedin && !isRegistering && (
                <Card title="Login" style={{ width: "100%" }}>
                  <Input.Group>
                    <h4>Username:</h4>
                    <Input autocomplete="off" onChange={this.handleChange} name="username" />
                  </Input.Group>
                  <br />
                  <Input.Group>
                    <h4>Password:</h4>
                    <Input autocomplete="off" type="password" onChange={this.handleChange} name="password" />
                  </Input.Group>
                  <br /><br />
                  <Button
                    type="primary"
                    style={{ width: "100%" }}
                    onClick={this.handleLogin}
                  >
                    Login
                  </Button>
                  <br /><br />
                  <h5 style={{ textAlign: "center" }}>{`Does not have account? `}
                    <a
                      style={{ color: "#1890ff" }}
                      onClick={() => { this.setState({ isRegistering: true }) }}
                    >Register</a>
                  </h5>
                </Card>
              )
            }
            {
              !isLoggedin && isRegistering && (
                <Card title="Register" style={{ width: "100%" }}>
                  <Input.Group>
                    <h4>Username:</h4>
                    <Input autocomplete="off" onChange={this.handleChange} name="username" />
                  </Input.Group>
                  <br />
                  <Input.Group>
                    <h4>Password:</h4>
                    <Input autocomplete="off" type="password" onChange={this.handleChange} name="password" />
                  </Input.Group>
                  <br />
                  <Input.Group>
                    <h4>Confirm password:</h4>
                    <Input autocomplete="off" type="password" onChange={this.handleChange} name="confirmPassword" />
                  </Input.Group>
                  <br />
                  <Input.Group>
                    <h4>Passenger Name:</h4>
                    <Input
                      onChange={this.handleChange}
                      name="name"
                      value={name}
                    />
                  </Input.Group>
                  <br />
                  <Input.Group>
                    <h4>National ID:</h4>
                    <Input
                      onChange={this.handleChange}
                      name="nationalId"
                      value={nationalId}
                    />
                  </Input.Group>
                  <br />
                  <Input.Group>
                    <h4>Email:</h4>
                    <Input
                      onChange={this.handleChange}
                      name="email"
                      value={email}
                    />
                  </Input.Group>
                  <br />
                  <Input.Group>
                    <h4>Current Address:</h4>
                    <Input
                      onChange={this.handleChange}
                      name="address"
                      value={address}
                    />
                  </Input.Group>
                  <br />
                  <Input.Group>
                    <h4>Date Of Birth: </h4>
                    {
                      dob ? <DatePicker
                        style={{ width: "100%" }}
                        format="YYYY-MM-DD"
                        onChange={this.onChangeDate}
                        value={moment(dob)}
                      /> :
                        <DatePicker
                          style={{ width: "100%" }}
                          format="YYYY-MM-DD"
                          onChange={this.onChangeDate}
                        />
                    }
                  </Input.Group>
                  <br /><br />
                  <Button
                    type="primary"
                    style={{ width: "100%" }}
                    onClick={this.handleRegister}
                  >
                    Register
                  </Button>
                  <br /><br />
                  <h5 style={{ textAlign: "center" }}>{`Already have account? `}
                    <a
                      style={{ color: "#1890ff" }}
                      onClick={() => { this.setState({ isRegistering: false }) }}
                    >Log in</a>
                  </h5>
                </Card>
              )
            }
          </Col>
          <Col span={2}></Col>
          <Col span={6}>
            <Card title="TripBus Ticket Details" style={{ width: "100%" }}>
              <p>
                <b>Route: </b>
                {this.props.start} - {this.props.end}
              </p>
              <p>
                <b>Date: </b>
                {moment(this.props.journeyDate).format("YYYY-MM-DD")}
              </p>
              <p>
                <b>Seat: </b>
                {this.props.seat}
              </p>
              <p>
                <b>Car Number: </b>
                {this.props.travelName}
              </p>
            </Card>

            <br />
            <Card title="Payment Details" style={{ width: "100%" }}>
              <p>
                <b>Per Ticket Cost: </b>{this.props.fare} VND
              </p>
              <p>
                <b>Total Cost: </b>{this.props.fare} VND
              </p>
            </Card>
          </Col>
          <Col span={4}></Col>
        </Row>
      </Layout>
    );
  }
}

Details.getInitialProps = ({ query }) => {
  const info = dec(query.info);
  if (info) {
    return info;
  }
  return {};
};

export default Details;
