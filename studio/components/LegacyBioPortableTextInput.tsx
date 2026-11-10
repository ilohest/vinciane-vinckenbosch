import {
  PatchEvent,
  set,
  useFormValue,
  type BlockDecoratorProps,
} from "sanity";

export function OrangeMarkIcon() {
  return <span style={{ color: "#DA7F52", fontWeight: 700 }}>A</span>;
}

export function OrangeMark(props: BlockDecoratorProps) {
  return <span style={{ color: "#DA7F52" }}>{props.children}</span>;
}

type PortableTextBlock = {
  _key: string;
  _type: "block";
  style: "normal";
  children: { _key: string; _type: "span"; text: string; marks: string[] }[];
  markDefs: [];
};

/**
 * Shows the existing plain paragraph as Portable Text until the editor first
 * saves the rich-text field. This keeps the current Sanity content editable
 * without an upfront data migration.
 */
export function LegacyBioPortableTextInput(
  props: any,
) {
  const richField = String(props.path[0] ?? "");
  const locale = String(props.path[props.path.length - 1] ?? "");
  const legacyField = richField.replace(/Rich$/, "");
  const legacyText = useFormValue([legacyField, locale]) as string | undefined;

  const hasStoredText = Array.isArray(props.value) && props.value.length > 0;
  if ((props.value !== undefined && hasStoredText) || !legacyText?.trim()) {
    return props.renderDefault(props);
  }

  const value: PortableTextBlock[] = [
    {
      _key: "legacy-bio-paragraph",
      _type: "block",
      style: "normal",
      children: [
        {
          _key: "legacy-bio-paragraph-span",
          _type: "span",
          text: legacyText,
          marks: [],
        },
      ],
      markDefs: [],
    },
  ];

  return (
    <div
      onPointerDownCapture={(event) => {
        // Materialize the displayed legacy text before the editor emits nested
        // mark patches. Prevent this first pointer press from focusing the
        // editor while the value is being inserted; the next click then focuses
        // the real stored value instead of resetting an editor with a fake one.
        if (props.value !== undefined && hasStoredText) return;
        event.preventDefault();
        props.onChange(PatchEvent.from(set(value)));
      }}
    >
      {props.renderDefault({ ...props, value })}
    </div>
  );
}
