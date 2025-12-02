const Certification = ({ title, certifications }) => {
  return (
    certifications.length > 0 && (
      <div>
        <h2 className="section-title mb-1 border-b-2 border-dashed border-gray-300">
          {title}
        </h2>
        <ul className="content list-disc ps-3.5">
          {certifications.map((certification, index) => (
            <li key={index}>{certification}</li>
          ))}
        </ul>
      </div>
    )
  )
}

export default Certification
