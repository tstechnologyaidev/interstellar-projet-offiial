import React from 'react';

export default function Privacy() {
  return (
    <section className="space-y-8 animate-in fade-in duration-1000 max-w-5xl mx-auto">
      <h2 className="text-4xl font-black uppercase text-orange-500">Privacy Policy</h2>
      <p className="text-zinc-300"><strong>1. Data Collection</strong><br/>We collect only the information you voluntarily provide when creating an account, such as username and email. No analytics or tracking scripts are included.</p>
      <p className="text-zinc-300"><strong>2. Data Usage</strong><br/>Your data is used solely for authentication and admin access. It is never shared with third parties.</p>
      <p className="text-zinc-300"><strong>3. Data Retention</strong><br/>Account data is retained until you delete your account. Admins may delete data upon request.</p>
      <p className="text-zinc-300"><strong>4. Security</strong><br/>All stored data is encrypted at rest and protected by server‑side access controls.</p>
      <p className="text-zinc-300"><strong>5. Your Rights</strong><br/>You may request data export or deletion by contacting the site owner.</p>
      <p className="text-zinc-300"><strong>6. Changes</strong><br/>We may update this policy; changes will be posted on this page with a revision date.</p>
    </section>
  );
}
