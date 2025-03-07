import LeadForm from "../components/leadForm";

export default function Home() {
  const handleSubmit = async (data: any) => {
    // Simulate submitting data to an API
    console.log("Form submitted:", data);
  };

  return (
    <div>
      <LeadForm onSubmit={handleSubmit} />
    </div>
  );
}
