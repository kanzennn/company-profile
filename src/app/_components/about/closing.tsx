import { aboutClosing } from "../../_lib/content/about";
import { AboutBand } from "./band";
import { ScrambleAction } from "../shared/scramble-action";

export function AboutClosing() {
  return (
    <div id="looking-ahead">
      <AboutBand title={aboutClosing.title} body={aboutClosing.body}>
        <ScrambleAction
          href="/contact"
          label="Start a conversation"
          className="mt-2 bg-primary px-10 py-3 font-mono text-body transition-colors hover:bg-primary-pressed"
        />
      </AboutBand>
    </div>
  );
}
