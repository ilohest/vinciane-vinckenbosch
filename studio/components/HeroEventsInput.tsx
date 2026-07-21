import {useEffect, useMemo, useState} from "react";
import {useClient} from "sanity";
import type {ArrayOfObjectsInputProps} from "sanity";

type HeroEventReference = {
  _key: string;
  _ref?: string;
};

function todayIsoDate(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Brussels",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function HeroEventsInput(props: ArrayOfObjectsInputProps<HeroEventReference>) {
  const {onItemRemove, value = []} = props;
  const client = useClient({apiVersion: "2024-01-01"});
  const [pastKeys, setPastKeys] = useState<Set<string>>(() => new Set());
  const refsByKey = useMemo(
    () =>
      value
        .filter((event) => event?._key && event?._ref)
        .map((event) => ({key: event._key, ref: event._ref as string})),
    [value],
  );

  useEffect(() => {
    if (refsByKey.length === 0) return;

    let cancelled = false;

    async function removePastEvents() {
      const today = todayIsoDate();
      const refs = refsByKey.map((event) => event.ref);
      const pastEvents = await client.fetch<Array<{_id: string}>>(
        `*[_id in $refs && defined(date) && date < $today]{_id}`,
        {refs, today},
      );

      if (cancelled) return;

      const pastRefSet = new Set(pastEvents.map((event) => event._id));
      const keysToRemove = refsByKey
        .filter((event) => pastRefSet.has(event.ref))
        .map((event) => event.key);

      setPastKeys(new Set(keysToRemove));
      keysToRemove.forEach((key) => onItemRemove(key));
    }

    removePastEvents().catch(console.error);

    return () => {
      cancelled = true;
    };
  }, [client, onItemRemove, refsByKey]);

  const visibleValue = value.filter((event) => !pastKeys.has(event._key));

  return props.renderDefault({
    ...props,
    value: visibleValue,
  });
}
