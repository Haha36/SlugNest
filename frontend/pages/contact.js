export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-rose-50 px-4 py-16">
      <div className="mx-auto flex max-w-2xl flex-col gap-12">
        {/* Header */}
        <section className="text-center">
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl text-slate-900">
            Contact Us
          </h1>
          <p className="mt-6 text-lg text-slate-600">
            We'd love to hear from you. Reach out if you need help or have any questions.
          </p>
        </section>

        {/* Contact Information Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h3 className="text-2xl font-semibold text-slate-900 mb-6">
            How Can We Help?
          </h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Finding a House</h4>
              <p className="text-slate-600">
                Need more help finding the home or have special requirement? 
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Questions</h4>
              <p className="text-slate-600">
                Have a question about our service, listings, or how SlugNest works? We're happy to help!
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Cooperate With Us</h4>
              <p className="text-slate-600">
                Interested in partnering with SlugNest? We'd love to explore collaboration opportunities!
              </p>
            </div>
          </div>

          <p className="mt-8 pt-8 border-t border-slate-200 text-slate-600">
            For any of these inquiries,{" "}
            <a
              href="mailto:help@slugnest.org"
              className="text-amber-600 font-semibold hover:text-amber-700"
            >
              email us →
            </a>
          </p>
        </div>

        {/* Email Section */}
        <section className="rounded-3xl bg-white px-8 py-14 text-center shadow-xl border border-amber-100">
          <h2 className="text-2xl font-semibold text-slate-900">
            Reach Out Directly
          </h2>
          <p className="mt-4 text-slate-600">
            For any inquiries, please email us at:
          </p>
          <a
            href="mailto:help@slugnest.org"
            className="mt-6 inline-block text-2xl font-semibold text-amber-600 hover:text-amber-700 break-all"
          >
            help@slugnest.org
          </a>
        </section>
      </div>
    </main>
  );
}
