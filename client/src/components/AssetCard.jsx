function AssetCard(props) {
  return (
    <div
      style={{
        background: "#1a1a1a",
        padding: "20px",
        borderRadius: "12px",
        width: "250px",
        color: "white"
      }}
    >
      <div
        style={{
          height: "150px",
          background: "#333",
          borderRadius: "10px",
          marginBottom: "15px"
        }}
      ></div>

      <h3>{props.title}</h3>
      <p>Creator: {props.creator}</p>
      <p>Price: {props.price} MATIC</p>
    </div>
  );
}

export default AssetCard;