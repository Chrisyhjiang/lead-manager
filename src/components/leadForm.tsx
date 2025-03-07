import { useForm } from "react-hook-form";
import { Lead } from "../types";
import styles from "../styles/home.module.css";
import { useRouter } from "next/router";
import axios from "axios";

interface LeadFormProps {
  onSubmit: (data: Lead) => void;
}

export const submitLeads = async (formData: FormData) => {
  try {
    const response = await axios.post("/api/submitLead", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting leads:", error);
    throw error;
  }
};

export default function LeadForm({ onSubmit }: LeadFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Lead>();

  const handleFormSubmit = async (data: Lead) => {
    // await onSubmit(data);
    // Prepare form data
    const formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("email", data.email);
    if (data.linkedin) formData.append("linkedin", data.linkedin);
    formData.append("visas", data.visa.join(","));
    // if (data.resume) formData.append("resume", data.resume);
    formData.append("message", data.message);

    if (data.resume) {
      console.log("Resume file:", data.resume); // Log the resume file
      formData.append("resume", data.resume[0]); // Append the first file
    } else {
      console.error("No resume file found!");
    }

    try {
      const response = await fetch("/api/submitLead", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Submission failed");

      // Save lead to sessionStorage
      const storedLeads = JSON.parse(sessionStorage.getItem("leads") || "[]");
      sessionStorage.setItem(
        "leads",
        JSON.stringify([...storedLeads, result.lead])
      );
      router.push("/thank-you");
    } catch (error) {
      console.error("Error submitting lead:", error);
      alert("Error submitting lead");
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <img src="/img/alma.png" alt="Logo" className={styles.logo} />
        <h1>Get An Assessment Of Your Immigration Case</h1>
      </header>

      <section className={styles.formSection}>
        <h2>Want to understand your visa options?</h2>
        <p>
          Submit the form below and our team of experienced attorneys will
          review your information and set up an advisory assessment of your case
          based on your goals.
        </p>

        <form
          encType="multipart/form-data"
          onSubmit={handleSubmit(handleFormSubmit)}
          className={styles.form}
        >
          {/* First Name */}
          <div className={styles.fieldGroup}>
            <input
              {...register("firstName", { required: true })}
              placeholder="First Name"
              className={styles.input}
            />
            {errors.firstName && (
              <span className={styles.error}>First name is required</span>
            )}
          </div>

          {/* Last Name */}
          <div className={styles.fieldGroup}>
            <input
              {...register("lastName", { required: true })}
              placeholder="Last Name"
              className={styles.input}
            />
            {errors.lastName && (
              <span className={styles.error}>Last name is required</span>
            )}
          </div>

          {/* Country */}
          <div className={styles.fieldGroup}>
            <input
              {...register("country", { required: true })}
              placeholder="Country"
              className={styles.input}
            />
            {errors.lastName && (
              <span className={styles.error}>Country is required</span>
            )}
          </div>

          {/* Email */}
          <div className={styles.fieldGroup}>
            <input
              {...register("email", { required: true })}
              placeholder="Email"
              className={styles.input}
            />
            {errors.email && (
              <span className={styles.error}>Email is required</span>
            )}
          </div>

          {/* LinkedIn URL */}
          <div className={styles.fieldGroup}>
            <input
              {...register("linkedin")}
              placeholder="LinkedIn Profile URL"
              className={styles.input}
            />
          </div>

          {/* Country of Citizenship */}
          <div className={styles.fieldGroup}>
            <select
              {...register("citizenship", { required: true })}
              className={styles.input}
            >
              <option value="">Select Country of Citizenship</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="MX">Mexico</option>
            </select>
            {errors.citizenship && (
              <span className={styles.error}>
                Country of citizenship is required
              </span>
            )}
          </div>

          {/* New Resume/CV Upload Field */}
          <div className={styles.fieldGroup}>
            <input
              type="file"
              {...register("resume", { required: true })}
              className={styles.input}
            />
            {errors.resume && (
              <span className={styles.error}>Resume/CV is required</span>
            )}
          </div>

          {/* Visa Categories */}
          <div className={styles.fieldGroup}>
            <h3>Visa categories of interest? *</h3>
            <div className={styles.visaOptionsVertical}>
              <label>
                <input
                  type="checkbox"
                  value="O-1A"
                  {...register("visa", {
                    validate: (value) =>
                      value && value.length > 0
                        ? true
                        : "At least one visa category is required",
                  })}
                />{" "}
                O-1A
              </label>
              <label>
                <input
                  type="checkbox"
                  value="H-1B"
                  {...register("visa", {
                    validate: (value) =>
                      value && value.length > 0
                        ? true
                        : "At least one visa category is required",
                  })}
                />{" "}
                H-1B
              </label>
              <label>
                <input
                  type="checkbox"
                  value="EB-1A"
                  {...register("visa", {
                    validate: (value) =>
                      value && value.length > 0
                        ? true
                        : "At least one visa category is required",
                  })}
                />{" "}
                EB-1A
              </label>
              <label>
                <input
                  type="checkbox"
                  value="EB-2NIW"
                  {...register("visa", {
                    validate: (value) =>
                      value && value.length > 0
                        ? true
                        : "At least one visa category is required",
                  })}
                />{" "}
                EB-2 NIW
              </label>
              <label>
                <input
                  type="checkbox"
                  value="unknown"
                  {...register("visa", {
                    validate: (value) =>
                      value && value.length > 0
                        ? true
                        : "At least one visa category is required",
                  })}
                />{" "}
                I don't know
              </label>
            </div>
            {errors.visa && (
              <span className={styles.error}>{errors.visa.message}</span>
            )}
          </div>

          {/* Message */}
          <div className={styles.fieldGroup}>
            <h3>How can we help you?</h3>
            <textarea
              {...register("message")}
              placeholder="What is your current status and when does it expire?..."
              className={styles.textareaLarge}
              rows={6}
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className={styles.button}>
            Submit
          </button>
        </form>
      </section>
    </div>
  );
}
