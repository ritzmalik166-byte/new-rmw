import { ServiceQueryForm } from "@/components/services/ServiceQueryForm";

type BlogEnquiryFormProps = {
  /** Where the visitor filled the form, e.g. "Blog: Top 50 Advertising Agencies in Delhi". */
  source: string;
};

export function BlogEnquiryForm({ source }: BlogEnquiryFormProps) {
  return (
    <ServiceQueryForm
      service="Blog"
      title="Quick enquiry"
      lede="Have a project? Let's discuss."
      doneText="Our team will call you within one working day."
      context={`Source: ${source}`}
      compact
      className="blog-enquiry"
    />
  );
}
