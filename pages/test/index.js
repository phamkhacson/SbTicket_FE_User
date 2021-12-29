import Layout from "../../components/Layout";

const Test = ({ user }) => {
  return (
    <Layout>
      <h1>Hello Group 15 - Class: Web Programming - 09 - Teacher: Tran Duc</h1>
    </Layout>
  );
};

Test.getInitialProps = () => {
  let user = "Ujjal";
  return { user };
};

export default Test;
