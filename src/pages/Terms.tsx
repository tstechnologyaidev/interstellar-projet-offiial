import React from 'react';
import { motion } from 'framer-motion';

export const Terms: React.FC = () => {
  return (
    <section className="flex flex-col items-center text-center space-y-6 py-12 min-h-[60vh] animate-in fade-in duration-1000">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-black text-white uppercase tracking-wide"
      >
        Terms of Service
      </motion.h1>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="max-w-3xl text-left text-zinc-300 leading-relaxed"
      >
        <p><strong>1. Acceptance of Terms</strong></p>
        <p>By accessing and using the Interstellar Project website (the “Service”), you agree to be bound by these Terms of Service (“Terms”). If you do not agree, you must discontinue use of the Service immediately.</p>
        <p><strong>2. Use of Service</strong></p>
        <p>You may use the Service for personal, non‑commercial purposes only. Any unauthorized use, including but not limited to copying, distributing, or modifying the source code, is strictly prohibited.</p>
        <p><strong>3. Account & Admin Access</strong></p>
        <p>Administrative functionality is protected by password and captcha. Only users granted admin privileges by the owner may access the admin panel. Unauthorized attempts will be blocked and may result in termination of access.</p>
        <p><strong>4. Intellectual Property</strong></p>
        <p>All content, designs, and code are the exclusive property of TSC Technology AI Dev. No part of the Service may be reproduced, distributed, or used in any other project without explicit written permission.</p>
        <p><strong>5. Disclaimer</strong></p>
        <p>The Service is provided “as is” without warranties of any kind. We do not guarantee that the Service will be error‑free or uninterrupted.</p>
        <p><strong>6. Limitation of Liability</strong></p>
        <p>In no event shall the owner be liable for any indirect, incidental, special, or consequential damages arising out of or related to the use of the Service.</p>
        <p><strong>7. Changes to Terms</strong></p>
        <p>We reserve the right to modify these Terms at any time. Continued use of the Service after changes constitutes acceptance of the new Terms.</p>
        <p><strong>8. Governing Law</strong></p>
        <p>These Terms shall be governed by and construed in accordance with the laws of the Province of Quebec, Canada.</p>
        <p>Last updated: May 2026.</p>
      </motion.div>
    </section>
  );
};
