import styled from "styled-components";

function Menu(props) {
  return (
    <Container>
      <p>{props.ele1}</p>
      <p>{props.ele2}</p>
      <p>{props.ele3}</p>
      <p>{props.ele4}</p>
      <p onClick={props.onClick}>{props.ele5}</p>
    </Container>
  );
}

export default Menu;

const Container = styled.div`
  position: absolute;
  right: 2.5rem;
  display: flex;
  flex-direction: column;
  background-color: whitesmoke;
  align-items: left;
  padding: 0px 20px 0px 20px;
  margin-top: 18rem;
  border-radius: 5px;
  color: gray;

  > p {
    cursor: pointer;

    :hover {
      background-color: #e9eaeb;
    }
  }
`;
