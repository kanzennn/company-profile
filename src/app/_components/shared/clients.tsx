import { clients } from "../../_lib/content/shared";

export function Clients() {
  return (
    <section
      id="clients"
      aria-labelledby="clients-heading"
      className="mx-auto flex w-full max-w-400 flex-col gap-20 px-5 max-lg:gap-10"
    >
      <div className="flex flex-col items-center justify-center gap-5">
        <h2 id="clients-heading" className="text-center text-headline-sm">
          Teams We Build For
        </h2>
        <p className="max-w-180 text-center font-mono text-body-lg opacity-70 max-lg:text-body">
          We work with founders, product teams, and agencies who need a partner
          that can take an idea from scope to shipped.
        </p>
      </div>

      <ul className="grid grid-cols-4 border-l border-t border-outline/50 max-lg:grid-cols-2">
        {clients.map((client) => (
          <li
            key={client}
            className="flex aspect-4/3 items-center justify-center border-r border-b border-outline/50"
          >
            <span className="font-mono text-title uppercase tracking-[0.2em] opacity-50 transition-opacity duration-300 hover:opacity-100 max-lg:text-body">
              {client}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
