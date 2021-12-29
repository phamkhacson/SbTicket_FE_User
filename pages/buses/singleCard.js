import { Card, Row, Col, Modal, Button } from "antd";
import Router from "next/router";
import SeatDetails from "./seatDetails";
import { API_ROOT } from "../../utils/config";
import { enc, dec } from "../../utils/encdec";

class SingleCard extends React.Component {
  state = { visible: false, userBooked: [] };

  showModal = () => {
    this.setState({
      visible: true,
      loading: false
    });
  };

  handleUserBooked = (seat) => {
    this.encryptInfo(seat);
  }

  handleOk = (info) => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, visible: false });
      Router.push({
        pathname: "/details",
        query: {info}
      });
    }, 1000);
  };

  encryptInfo = seat => {
    console.log(this.props.bus)
    const startLocation = this.props.bus.tripBus.lineBus.firstPoint.address;
    const endLocation = this.props.bus.tripBus.lineBus.lastPoint.address;
    const fare = this.props.bus.tripBus.priceTrip;
    const journeyDate = this.props.bus.tripBus.timeTrip;
    const travel = this.props.bus.tripBus.bus.carNumber;
    const tripBusId = this.props.bus.tripBus.id;
    let start = startLocation;
    let end = endLocation;
    let travelName = travel;
    const info = {start, end, fare, journeyDate, travelName, seat, tripBusId}
    const resp = enc(info);
    this.handleOk(resp)
  }

  handleCancel = e => {
    this.setState({
      visible: false
    });
  };

  seatColorMeaning = () => {
    return(
      <>
        <div style={{display: 'flex', alignItems: 'start', flexDirection: 'row-reverse'}}>
          <p>Available</p>
          <Button type="primary" style={{margin: '0 1rem'}}></Button>
          <p>Booked</p>
          <Button style={{backgroundColor: "rgb(67, 67, 67)", margin: '0 1rem'}}></Button>
        </div>
      </>
    )
  }

  seatModal = () => (
    <Modal
      title="Seat Details"
      visible={this.state.visible}
      onCancel={this.handleCancel}
      footer={[
        this.seatColorMeaning()
      ]}
      >
      <SeatDetails
        booked={this.props.bus.bookedSeat}
        totalSeats={this.props.bus.tripBus.bus.numberSeats}
        setBooked={() => {}}
        slug={"ss"}
        handleUserBooked={this.handleUserBooked}
      />
    </Modal>
  );

  render() {
    const { bus } = this.props;
    return (
      <>
        <Card
          className="single-card"
          style={{ width: "100%", marginBottom: "1rem" }}
          onClick={this.showModal}
        >
          <Row>
            <Col span={3}>
              <img
                src={`https://image.vtc.vn/resize/th/upload/2020/10/20/a1-1-09592765.jpg`}
                alt="suspense"
                className="bus-thumbnail"
              />
            </Col>
            <Col span={1}></Col>
            <Col span={4}>
              <p>{bus.tripBus.bus.carNumber}</p>
            </Col>
            <Col span={4}>
              <p>{bus.tripBus.bus.manufacturer}</p>
            </Col>
            <Col span={4}>
              <strong>
                <p>{bus.tripBus.timeTrip.substring(0,10).replaceAll("-", "/")}</p>
              </strong>
            </Col>
            <Col span={4}>
              <p>{bus.tripBus.bus.numberSeats - bus.tripBus.numberGuest} seats</p>
            </Col>
            <Col span={4}>
              <p>{`${bus.tripBus.priceTrip}`} VNĐ</p>
            </Col>
          </Row>
        </Card>
        {this.state.visible && this.seatModal()}
      </>
    );
  }
}

export default SingleCard;
