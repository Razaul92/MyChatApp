import { Circle } from "better-react-spinkit";

function Loading() {
  return (
    <center style={{ display: "grid", placeItems: "center", height: "80vh" }}>
      <div>
        <img
          src="chatlogo.png"
          alt=""
          style={{
            marginBottom: 10,
            borderRadius: "1rem",
            boxShadow: "0px 4px 14px -3px rgba(0, 0, 0, 0.7)",
          }}
          height={200}
        />
      </div>
      <Circle color="tomato" size={60} />
    </center>
  );
}

export default Loading;
