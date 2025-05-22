export default function GoogleMap() {
  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden shadow-md">
      <iframe
        src="https://www.google.com/maps/embed/v1/place?key=AIzaSyCZ_TChDaQZmVEVHpI43kN5altpQMrbA_M&q=Space+Needle,Seattle+WA"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="MSBUILDER's Location"
      ></iframe>
    </div>
  )
}

