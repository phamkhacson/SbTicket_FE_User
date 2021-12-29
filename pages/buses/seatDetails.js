import React, { Component } from "react";
// import { postSoldSeat } from "../../../Utils/Requests/Booking";
import Swal from "sweetalert2";
import { Button } from "antd";

class SeatDetails extends Component {
  constructor() {
    super();
    this.state = {
      size: "small",
      arr: [0, 2.5, 5, 7.5, 10, 12.5, 15],
      oddA: [],
      evenA: [],
      oddB: [],
      evenB: [],
    };
  }

  componentDidMount(){
    const { totalSeats } = this.props;
    let oddA = [];
    let evenA = [];
    let oddB = [];
    let evenB = [];
    for(let i = 1; i <= totalSeats; i = i + 4){
      oddA.push(i);
      evenA.push(i+1);
      oddB.push(i+2);
      evenB.push(i+3);
    }
    this.setState({
      oddA,
      evenA,
      oddB,
      evenB
    })
  }

  handleClick = async seat => {
    Swal.fire({
      title: "Are you sure?",
      text: "Book seat!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, book it!"
    }).then(result => {
      if (result.value) {
        this.props.handleUserBooked(seat)
      }
    });
  };

  render() {
    const { size, arr, oddA, oddB, evenA, evenB } = this.state;
    const { booked } = this.props;
    return (
      <div style={{display: "flex", justifyContent: "center"}}>
        <div style={styles.wrapper}>
          <div className="steer" style={styles.steer}>
            <img style={styles.img} src="/static/img/steer.png" />
          </div>
          <div style={styles.busDiv}>
            {arr.map((le, i) => {
              return (
                <div key={i}>
                  <Button
                    className="btn btn-sm btn-primary"
                    type="primary"
                    size={size}
                    disabled={
                       booked.includes(oddA[i])
                        ? true
                        : false
                    }
                    style={
                      booked.includes(oddA[i])
                        ? styles.bookedButton
                        : styles.button
                    }
                    onClick={() => this.handleClick(oddA[i])}
                  >
                    {oddA[i]}
                  </Button>
                  <Button
                    className="btn btn-sm btn-primary"
                    type="primary"
                    size={size}
                    disabled={
                      booked.includes(evenA[i])
                        ? true
                        : false
                    }
                    style={
                      booked.includes(evenA[i])
                        ? styles.bookedButton
                        : styles.button
                    }
                    onClick={() => this.handleClick(evenA[i])}
                  >
                    {evenA[i]}
                  </Button>
                </div>
              );
            })}
            {arr.map((le, i) => (
              <div
                key={i}
                style={{ ...styles.secondCol, ...{ top: `${le}rem` } }}
              >
                <Button
                  className="btn btn-sm btn-primary"
                  type="primary"
                  disabled={
                    booked.includes(oddB[i])
                      ? true
                      : false
                  }
                  size={size}
                  style={
                    booked.includes(oddB[i])
                      ? styles.bookedButton
                      : styles.button
                  }
                  onClick={() => this.handleClick(oddB[i])}
                >
                  {oddB[i]}
                </Button>
                <Button
                  className="btn btn-sm btn-primary"
                  type="primary"
                  disabled={
                    booked.includes(evenB[i])
                      ? true
                      : false
                  }
                  size={size}
                  style={
                    booked.includes(evenB[i])
                      ? styles.bookedButton
                      : styles.button
                  }
                  onClick={() => this.handleClick(evenB[i])}
                >
                  {evenB[i]}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  wrapper: {
    height: "60vh",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    justifyContent: "center"
  },
  steer: {
    margin: ".5rem",
    position: "relative",
    top: 0,
    left: "12rem"
  },
  img: {
    height: "3rem",
    transform: "rotate(90deg)"
  },
  busDiv: {
    background: "#434343",
    height: "18rem",
    position: "relative",
    width: "17rem",
    color: "#ffff"
  },
  secondCol: {
    position: "absolute",
    top: 0,
    right: 0
  },
  soldButton: {
    background: "#ff4d4f",
    color: "#ffff",
    margin: ".5rem"
  },
  bookedButton: {
    background: "#434343",
    color: "#ffff",
    margin: ".5rem"
  },
  button: {
    margin: ".5rem"
  }
};

export default SeatDetails;
