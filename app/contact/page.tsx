import ContactForm from "@/components/contact/contact-form"
import GoogleMap from "@/components/contact/google-map"
import { Building2, Clock, Phone } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 page-transition">
      <h1 className="text-4xl font-bold text-center mb-12">Contact Us</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
          <ContactForm />
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-6">Our Location</h2>
          <GoogleMap />

          <div className="mt-8 space-y-4">
            <div className="flex items-start space-x-3">
              <Building2 className="h-6 w-6 text-primary mt-1" />
              <div>
                <h3 className="font-medium">Office Address</h3>
                <p className="text-muted-foreground">123 Real Estate Avenue, Building District, City 10001</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Phone className="h-6 w-6 text-primary mt-1" />
              <div>
                <h3 className="font-medium">Phone Number</h3>
                <p className="text-muted-foreground">+1 (555) 123-4567</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Clock className="h-6 w-6 text-primary mt-1" />
              <div>
                <h3 className="font-medium">Working Hours</h3>
                <p className="text-muted-foreground">Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p className="text-muted-foreground">Saturday: 10:00 AM - 4:00 PM</p>
                <p className="text-muted-foreground">Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
