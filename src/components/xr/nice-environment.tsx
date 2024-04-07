
export function NiceLight(props) {
    return (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight position={[0, 10, 5]} intensity={1} />
        </>
    );
}

