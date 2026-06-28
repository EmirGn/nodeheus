"use client";

import { useState } from "react";
import s from "./studio.module.css";
import FluidArt from "./FluidArt";

type Service = {
  no: string;
  title: string;
  body: string;
  seed: number;
};

const SERVICES: Service[] = [
  {
    no: "01",
    title: "Marketing",
    body: "Full-funnel digital marketing services to reach your target audience without the overwhelm. We identify gaps in your current marketing strategy, then consult on what you need and how we'll make it happen — activities the contract assigned.",
    seed: 11,
  },
  {
    no: "02",
    title: "Web Development",
    body: "Design-led engineering for products that ship. From marketing sites to full platforms, we build fast, accessible, type-safe front-ends on a modern stack — and we own the result end to end.",
    seed: 23,
  },
  {
    no: "03",
    title: "Motion Graphics",
    body: "Brand systems that move. We craft the identity, the type and the motion language that makes a product feel alive across every surface it touches — from launch film to micro-interaction.",
    seed: 31,
  },
];

export function ServicesAccordion() {
  const [open, setOpen] = useState(0);
  return (
    <div className={s.accordion}>
      {SERVICES.map((svc, i) => {
        const isOpen = i === open;
        return (
          <div
            key={svc.no}
            className={`${s.accItem} ${isOpen ? s.accOpen : ""}`}
          >
            <button
              className={s.accHead}
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
            >
              <span className={s.accNo}>[{svc.no}]</span>
              <span className={s.accTitle}>{svc.title}</span>
              <span className={s.accSign}>{isOpen ? "−" : "+"}</span>
            </button>
            <div className={s.accPanel} hidden={!isOpen}>
              <p className={s.accBody}>{svc.body}</p>
              <div className={s.accThumb}>
                <FluidArt seed={svc.seed} freq="0.012 0.016" scale={40} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ContactForm() {
  const [sent, setSent] = useState(false);

  return (
    <form
      className={s.form}
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <label className={s.field}>
        <span className={s.fieldLabel}>Name</span>
        <input className={s.input} name="name" required placeholder="Your name" />
      </label>
      <label className={s.field}>
        <span className={s.fieldLabel}>Email</span>
        <input
          className={s.input}
          name="email"
          type="email"
          required
          placeholder="you@company.com"
        />
      </label>
      <label className={s.field}>
        <span className={s.fieldLabel}>Project details [optional]</span>
        <input
          className={s.input}
          name="details"
          placeholder="Tell us what you're building"
        />
      </label>
      <button className={s.send} type="submit">
        {sent ? "Sent — we'll be in touch" : "Send form"}
        <span className={s.sendArrow} aria-hidden="true">
          →
        </span>
      </button>
    </form>
  );
}
