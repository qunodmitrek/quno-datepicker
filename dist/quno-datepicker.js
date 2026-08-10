import { jsx as l, jsxs as M } from "preact/jsx-runtime";
import { useState as $, useEffect as W, useRef as ot } from "preact/hooks";
function Y(t) {
  var e, n, r = "";
  if (typeof t == "string" || typeof t == "number") r += t;
  else if (typeof t == "object") if (Array.isArray(t)) {
    var d = t.length;
    for (e = 0; e < d; e++) t[e] && (n = Y(t[e])) && (r && (r += " "), r += n);
  } else for (n in t) t[n] && (r && (r += " "), r += n);
  return r;
}
function m() {
  for (var t, e, n = 0, r = "", d = arguments.length; n < d; n++) (t = arguments[n]) && (e = Y(t)) && (r && (r += " "), r += e);
  return r;
}
const dt = 864e5, F = (t) => t.toString().padStart(2, "0"), I = (t) => `${t.getUTCFullYear()}-${F(t.getUTCMonth() + 1)}-${F(
  t.getUTCDate()
)}`, U = (t) => {
  const [e, n, r] = t.split("-").map(Number);
  return new Date(Date.UTC(e, n - 1, r));
}, it = () => {
  const t = /* @__PURE__ */ new Date();
  return `${t.getFullYear()}-${F(t.getMonth() + 1)}-${F(
    t.getDate()
  )}`;
}, k = (t, e) => t.localeCompare(e), A = (t, e) => {
  const n = U(t);
  return n.setUTCDate(n.getUTCDate() + e), I(n);
}, L = (t, e) => Math.round((U(t).getTime() - U(e).getTime()) / dt), q = (t) => `${t.slice(0, 7)}-01`, J = (t) => {
  const e = U(q(t));
  return e.setUTCMonth(e.getUTCMonth() + 1), e.setUTCDate(0), I(e);
}, st = (t, e) => {
  const n = U(q(t));
  return n.setUTCMonth(n.getUTCMonth() + e), I(n);
}, z = (t, e) => t.slice(0, 7) === e.slice(0, 7), R = (t, e) => k(t, e) <= 0 ? { start: t, end: e } : { start: e, end: t }, Z = (t, e) => {
  if (t.start === t.end)
    return k(e, t.start) < 0 ? "start" : "end";
  const n = Math.abs(L(e, t.start)), r = Math.abs(L(e, t.end));
  return n < r ? "start" : "end";
}, Q = (t, e, n) => {
  const r = e === "start" ? t.end : t.start, d = e === "start" ? k(n, r) > 0 : k(n, r) < 0;
  return {
    range: R(n, r),
    endpoint: d ? e === "start" ? "end" : "start" : e
  };
}, ct = (t, e, n) => n === "single" ? { start: e, end: e } : Q(t, n, e).range, ut = (t, e) => {
  const n = k(e, t.start) < 0 ? "start" : k(e, t.end) > 0 ? "end" : Z(t, e);
  return {
    defaultAction: n,
    alternatives: [n === "start" ? "end" : "start", "single"]
  };
}, At = (t, e) => t ? Q(t, Z(t, e), e).range : { start: e, end: e }, lt = (t, e, n) => {
  const r = L(n, e);
  return {
    start: A(t.start, r),
    end: A(t.end, r)
  };
}, pt = (t, e = 1) => {
  const n = U(q(t)), r = (n.getUTCDay() - e + 7) % 7, d = A(I(n), -r), f = U(J(t)), c = ((e + 6) % 7 - f.getUTCDay() + 7) % 7, u = A(I(f), c + 7), D = L(u, d) + 1;
  return Array.from(
    { length: D },
    (y, i) => A(d, i)
  );
}, j = (t, e) => k(t, e.start) >= 0 && k(t, e.end) <= 0, yt = (t, e) => k(t, q(e)) < 0 ? "before" : k(t, J(e)) > 0 ? "after" : "visible", ft = ({
  dates: t,
  visibleMonth: e,
  selection: n,
  renderedSelection: r,
  config: d,
  onBegin: f,
  onEnter: o,
  onFinish: c
}) => {
  const { labels: u, formatters: D, locale: y, classNames: i } = d;
  return /* @__PURE__ */ l(
    "div",
    {
      className: m("quno-date-picker__grid", i == null ? void 0 : i.grid),
      "data-slot": "grid",
      role: "grid",
      "aria-label": `${u.calendar}: ${D.month(
        e,
        y
      )}`,
      children: t.map((s) => {
        const v = z(s, e), a = n ? j(s, n) : !1, h = r ? j(s, r) : !1, T = (r == null ? void 0 : r.start) === s, g = (r == null ? void 0 : r.end) === s;
        return /* @__PURE__ */ M(
          "button",
          {
            type: "button",
            role: "gridcell",
            className: m(
              "quno-date-picker__day",
              {
                "quno-date-picker__day--outside": !v,
                "quno-date-picker__day--selected": h,
                "quno-date-picker__day--committed": a,
                "quno-date-picker__day--start": T,
                "quno-date-picker__day--end": g
              },
              i == null ? void 0 : i.day
            ),
            "data-slot": "day",
            "data-date": s,
            "data-range-start": T ? "true" : void 0,
            "data-range-end": g ? "true" : void 0,
            "data-outside": v ? void 0 : "true",
            "data-selected": h ? "true" : void 0,
            "data-committed": a ? "true" : void 0,
            "aria-label": D.dayLabel(s, y),
            "aria-selected": a,
            onPointerDown: (_) => {
              _.preventDefault(), f(s);
            },
            onPointerEnter: () => o(s),
            onPointerUp: (_) => {
              _.preventDefault(), c(s);
            },
            children: [
              /* @__PURE__ */ l("span", { children: Number(s.slice(-2)) }),
              (T || g) && /* @__PURE__ */ l(
                "i",
                {
                  className: m(
                    "quno-date-picker__handle",
                    i == null ? void 0 : i.handle
                  ),
                  "data-slot": "handle",
                  "aria-hidden": "true"
                }
              )
            ]
          },
          s
        );
      })
    }
  );
}, ht = ({
  visibleMonth: t,
  config: e,
  onNavigate: n
}) => {
  const { labels: r, formatters: d, locale: f, classNames: o } = e;
  return /* @__PURE__ */ M(
    "div",
    {
      className: m(
        "quno-date-picker__month-header",
        o == null ? void 0 : o.monthHeader
      ),
      "data-slot": "month-header",
      children: [
        /* @__PURE__ */ l(
          "button",
          {
            type: "button",
            className: o == null ? void 0 : o.previousButton,
            "data-slot": "previous-button",
            "aria-label": r.previousMonth,
            onClick: () => n(-1),
            children: "‹"
          }
        ),
        /* @__PURE__ */ l("h2", { className: o == null ? void 0 : o.monthHeading, "data-slot": "month-heading", children: d.month(t, f) }),
        /* @__PURE__ */ l(
          "button",
          {
            type: "button",
            className: o == null ? void 0 : o.nextButton,
            "data-slot": "next-button",
            "aria-label": r.nextMonth,
            onClick: () => n(1),
            children: "›"
          }
        )
      ]
    }
  );
}, O = (t, e) => {
  const n = t == null ? void 0 : t.closest(
    "[data-day-index]"
  );
  return e.indexOf(Number(n == null ? void 0 : n.dataset.dayIndex));
}, gt = ({ controller: t, config: e }) => {
  const [n, r] = $({ type: "weekdays" }), { classNames: d, formatters: f, locale: o } = e, { interaction: c, renderedSelection: u, weekdays: D } = t, y = c.type === "create" || c.type === "drag-endpoint" || c.type === "drag-range", i = Array.from(
    { length: 7 },
    (a, h) => A(t.gridDates[0], h - 7)
  );
  W(() => {
    y || r({ type: "weekdays" });
  }, [y]);
  const s = (a) => {
    !y || a < 0 || (r({ type: "previous-dates", fromIndex: a }), t.enterDay(i[a]));
  }, v = (a) => {
    r({ type: "weekdays" }), t.finishDrag(a);
  };
  return /* @__PURE__ */ l(
    "div",
    {
      className: m("quno-date-picker__weekdays", d == null ? void 0 : d.weekdays),
      "data-slot": "weekdays",
      "data-drag-overflow": n.type === "previous-dates" ? "previous" : void 0,
      "data-drag-active": y ? "true" : void 0,
      "aria-hidden": "true",
      onPointerEnter: (a) => s(O(a.target, D)),
      onPointerLeave: () => r({ type: "weekdays" }),
      onPointerUp: (a) => {
        if (!y) return;
        const h = O(a.target, D);
        h < 0 || (a.preventDefault(), v(i[h]));
      },
      children: D.map((a, h) => {
        if (!(n.type === "previous-dates" && h >= n.fromIndex))
          return /* @__PURE__ */ l(
            "span",
            {
              className: d == null ? void 0 : d.weekday,
              "data-slot": "weekday",
              "data-day-index": a,
              onPointerEnter: () => s(h),
              children: f.weekday(a, o)
            },
            a
          );
        const g = i[h], _ = u ? j(g, u) : !1, b = (u == null ? void 0 : u.start) === g, x = (u == null ? void 0 : u.end) === g;
        return /* @__PURE__ */ l(
          "span",
          {
            className: m(
              "quno-date-picker__day",
              "quno-date-picker__day--outside",
              "quno-date-picker__overflow-day",
              _ && "quno-date-picker__day--selected",
              b && "quno-date-picker__day--start",
              x && "quno-date-picker__day--end",
              d == null ? void 0 : d.day,
              d == null ? void 0 : d.overflowDay
            ),
            "data-slot": "overflow-day",
            "data-day-index": a,
            "data-date": g,
            "data-selected": _ ? "true" : void 0,
            "data-range-start": b ? "true" : void 0,
            "data-range-end": x ? "true" : void 0,
            "data-outside": "true",
            onPointerEnter: () => s(h),
            onPointerUp: (P) => {
              P.preventDefault(), P.stopPropagation(), v(g);
            },
            children: /* @__PURE__ */ l("span", { children: Number(g.slice(-2)) })
          },
          a
        );
      })
    }
  );
}, vt = ({ controller: t, config: e }) => {
  const { classNames: n } = e;
  return /* @__PURE__ */ M(
    "div",
    {
      className: m("quno-date-picker__calendar-shell", n == null ? void 0 : n.calendar),
      "data-slot": "calendar",
      children: [
        ["previous", "next"].map((r) => /* @__PURE__ */ l(
          "div",
          {
            className: m(
              "quno-date-picker__edge",
              `quno-date-picker__edge--${r}`,
              n == null ? void 0 : n.edge
            ),
            "data-slot": "edge",
            "data-direction": r,
            "aria-hidden": "true",
            onPointerEnter: () => t.startEdgeNavigation(r === "previous" ? -1 : 1),
            onPointerLeave: t.stopEdgeNavigation
          },
          r
        )),
        /* @__PURE__ */ l(
          ht,
          {
            visibleMonth: t.visibleMonth,
            config: e,
            onNavigate: t.navigate
          }
        ),
        /* @__PURE__ */ l(gt, { controller: t, config: e }),
        /* @__PURE__ */ l(
          ft,
          {
            dates: t.gridDates,
            visibleMonth: t.visibleMonth,
            selection: t.selection,
            renderedSelection: t.renderedSelection,
            config: e,
            onBegin: t.beginDrag,
            onEnter: t.enterDay,
            onFinish: t.finishDrag
          }
        )
      ]
    }
  );
}, mt = (t, e) => new Intl.DateTimeFormat(e, {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC"
}).format(/* @__PURE__ */ new Date(`${t}T00:00:00Z`)), Dt = (t, e) => new Intl.DateTimeFormat(e, {
  month: "long",
  year: "numeric",
  timeZone: "UTC"
}).format(/* @__PURE__ */ new Date(`${t}T00:00:00Z`)), _t = (t, e) => new Intl.DateTimeFormat(e, {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC"
}).format(/* @__PURE__ */ new Date(`${t}T00:00:00Z`)), kt = (t, e) => new Intl.DateTimeFormat(e, {
  weekday: "short",
  timeZone: "UTC"
}).format(new Date(Date.UTC(2026, 7, 2 + t))), bt = {
  calendar: "Date range picker",
  selectedPeriod: "Selected period",
  chooseDate: "Choose a date",
  clear: "Clear",
  start: "Start",
  end: "End",
  previousMonth: "Previous month",
  nextMonth: "Next month",
  chooseAction: "Change selected day to",
  startDate: "Start date",
  endDate: "End date",
  thisDate: "This date",
  hint: "Click the same date again to cycle its role, or drag to adjust the period."
}, Tt = {
  date: mt,
  month: Dt,
  dayLabel: _t,
  weekday: kt
}, S = ({
  selection: t,
  visibleMonth: e,
  position: n,
  config: r,
  onJump: d
}) => {
  if (!t)
    return null;
  const o = [
    { endpoint: "start", date: t.start },
    { endpoint: "end", date: t.end }
  ].filter(
    ({ date: i }) => yt(i, e) === n
  );
  if (!o.length)
    return null;
  const { labels: c, formatters: u, locale: D, classNames: y } = r;
  return /* @__PURE__ */ l(
    "div",
    {
      className: m(
        "quno-date-picker__pills",
        `quno-date-picker__pills--${n}`,
        y == null ? void 0 : y.pills
      ),
      "data-slot": "pills",
      "data-position": n,
      children: o.map(({ endpoint: i, date: s }) => /* @__PURE__ */ M(
        "button",
        {
          type: "button",
          className: m("quno-date-picker__pill", y == null ? void 0 : y.pill),
          "data-slot": "pill",
          "data-endpoint": i,
          "data-position": n,
          onClick: () => d(s),
          children: [
            /* @__PURE__ */ l("span", { children: i === "start" ? c.start : c.end }),
            u.date(s, D),
            /* @__PURE__ */ l("span", { "aria-hidden": "true", children: n === "before" ? "↑" : "↓" })
          ]
        },
        `${i}-${s}`
      ))
    }
  );
}, wt = ({
  selection: t,
  config: e,
  onClear: n
}) => {
  const { labels: r, formatters: d, locale: f, classNames: o } = e, c = t ? t.start === t.end ? d.date(t.start, f) : `${d.date(t.start, f)} – ${d.date(
    t.end,
    f
  )}` : r.chooseDate;
  return /* @__PURE__ */ M(
    "header",
    {
      className: m(
        "quno-date-picker__selection-header",
        o == null ? void 0 : o.selectionHeader
      ),
      "data-slot": "selection-header",
      children: [
        /* @__PURE__ */ M("div", { children: [
          /* @__PURE__ */ l(
            "span",
            {
              className: m(
                "quno-date-picker__eyebrow",
                o == null ? void 0 : o.selectionEyebrow
              ),
              "data-slot": "selection-eyebrow",
              children: r.selectedPeriod
            }
          ),
          /* @__PURE__ */ l(
            "strong",
            {
              className: o == null ? void 0 : o.selectionSummary,
              "data-slot": "selection-summary",
              children: c
            }
          )
        ] }),
        /* @__PURE__ */ l(
          "button",
          {
            type: "button",
            className: m("quno-date-picker__clear", o == null ? void 0 : o.clearButton),
            "data-slot": "clear-button",
            disabled: !t,
            onClick: n,
            children: r.clear
          }
        )
      ]
    }
  );
}, C = () => ({ type: "idle" }), G = (t, e, n) => ({
  type: "drag-endpoint",
  endpoint: e,
  origin: n,
  anchor: e === "start" ? t.end : t.start,
  current: t,
  moved: !1
}), Et = (t, e) => {
  if (!t)
    return {
      type: "create",
      origin: e,
      current: { start: e, end: e },
      moved: !1
    };
  const n = e === t.start ? "start" : e === t.end ? "end" : null;
  return n ? G(t, n, e) : j(e, t) ? {
    type: "drag-range",
    origin: e,
    original: t,
    current: t,
    moved: !1
  } : G(t, Z(t, e), e);
}, K = (t, e) => t.type === "idle" ? t : t.type === "create" ? {
  ...t,
  current: R(t.origin, e),
  moved: t.moved || e !== t.origin
} : t.type === "drag-range" ? {
  ...t,
  current: lt(t.original, t.origin, e),
  moved: t.moved || e !== t.origin
} : {
  ...t,
  endpoint: k(e, t.anchor) <= 0 ? "start" : "end",
  current: R(t.anchor, e),
  moved: t.moved || e !== t.origin
}, X = (t) => {
  for (let e = t.index + 1; e < t.actions.length; e += 1) {
    const n = ct(
      t.original,
      t.date,
      t.actions[e]
    );
    if (n.start !== t.value.start || n.end !== t.value.end)
      return { cycle: e === t.actions.length - 1 ? null : { ...t, index: e, value: n }, value: n, changed: !0 };
  }
  return { cycle: null, value: t.value, changed: !1 };
}, Ct = (t, e) => {
  if (t.type === "idle")
    return { interaction: t };
  if (t.moved) {
    const c = K(t, e);
    return c.type === "idle" ? { interaction: c } : { interaction: C(), value: c.current };
  }
  if (t.type === "create")
    return { interaction: C(), value: { start: e, end: e } };
  const n = t.current, r = ut(n, e), d = r.defaultAction === "start" ? "end" : "start", f = [
    r.defaultAction,
    d,
    "single"
  ], o = X({
    date: e,
    original: n,
    actions: f,
    index: -1,
    value: n
  });
  return {
    interaction: C(),
    value: o.changed ? o.value : void 0,
    cycle: o.cycle ?? void 0
  };
}, qt = ({
  value: t,
  defaultValue: e,
  initialMonth: n,
  weekStartsOn: r,
  autoNavigateDelay: d,
  autoNavigateRepeatDelay: f,
  onChange: o,
  onVisibleMonthChange: c
}) => {
  const u = t !== void 0, [D, y] = $(e), i = u ? t ?? null : D, [s, v] = $(
    q(n ?? (i == null ? void 0 : i.start) ?? it())
  ), [a, h] = $(C()), [T, g] = $(null), _ = ot(null), b = () => {
    _.current !== null && (window.clearTimeout(_.current), _.current = null);
  };
  W(() => b, []);
  const x = (p) => {
    u || y(p), o == null || o(p);
  }, P = (p) => {
    v(p), c == null || c(p);
  }, H = (p) => {
    v((w) => {
      const E = st(w, p);
      return c == null || c(E), E;
    }), g(null);
  }, V = (a.type === "create" || a.type === "drag-endpoint" || a.type === "drag-range" ? a.current : null) ?? i, N = (p) => {
    b(), h(Et(i, p));
  }, tt = (p) => {
    h((w) => K(w, p));
  }, et = (p) => {
    if (b(), (T == null ? void 0 : T.date) === p && a.type !== "idle" && !a.moved) {
      const B = X(T);
      g(B.cycle), h(C()), B.changed && x(B.value);
      return;
    }
    const E = Ct(a, p);
    h(E.interaction), g(E.cycle ?? null), E.value && x(E.value), z(p, s) || P(q(p));
  }, nt = (p) => {
    if (a.type !== "create" && a.type !== "drag-endpoint" && a.type !== "drag-range")
      return;
    b();
    const w = () => {
      H(p), _.current = window.setTimeout(w, f);
    };
    _.current = window.setTimeout(w, d);
  }, rt = () => {
    b(), h(C()), g(null), x(null);
  }, at = (p) => {
    b(), h(C()), g(null), P(q(p));
  };
  return {
    selection: i,
    renderedSelection: V,
    visibleMonth: s,
    interaction: a,
    gridDates: pt(s, r),
    weekdays: Array.from({ length: 7 }, (p, w) => (r + w) % 7),
    beginDrag: N,
    enterDay: tt,
    finishDrag: et,
    clear: rt,
    navigate: H,
    startEdgeNavigation: nt,
    stopEdgeNavigation: b,
    jumpToEndpoint: at
  };
}, Pt = ({
  value: t,
  defaultValue: e = null,
  initialMonth: n,
  locale: r = "en-GB",
  labels: d,
  formatters: f,
  weekStartsOn: o = 1,
  className: c,
  classNames: u,
  autoNavigateDelay: D = 400,
  autoNavigateRepeatDelay: y = 650,
  onChange: i,
  onVisibleMonthChange: s
}) => {
  const v = {
    locale: r,
    labels: { ...bt, ...d },
    formatters: { ...Tt, ...f },
    classNames: u
  }, a = qt({
    value: t,
    defaultValue: e,
    initialMonth: n,
    weekStartsOn: o,
    autoNavigateDelay: D,
    autoNavigateRepeatDelay: y,
    onChange: i,
    onVisibleMonthChange: s
  });
  return /* @__PURE__ */ M(
    "section",
    {
      className: m("quno-date-picker", c, u == null ? void 0 : u.root),
      "data-slot": "root",
      "aria-label": v.labels.calendar,
      onPointerUp: a.stopEdgeNavigation,
      children: [
        /* @__PURE__ */ l(
          wt,
          {
            selection: a.selection,
            config: v,
            onClear: a.clear
          }
        ),
        /* @__PURE__ */ l(
          S,
          {
            selection: a.selection,
            visibleMonth: a.visibleMonth,
            position: "before",
            config: v,
            onJump: a.jumpToEndpoint
          }
        ),
        /* @__PURE__ */ l(vt, { controller: a, config: v }),
        /* @__PURE__ */ l(
          S,
          {
            selection: a.selection,
            visibleMonth: a.visibleMonth,
            position: "after",
            config: v,
            onJump: a.jumpToEndpoint
          }
        ),
        /* @__PURE__ */ l(
          "p",
          {
            className: m("quno-date-picker__hint", u == null ? void 0 : u.hint),
            "data-slot": "hint",
            children: v.labels.hint
          }
        )
      ]
    }
  );
};
export {
  Pt as QunoDatePicker,
  A as addDays,
  st as addMonths,
  ct as applyDateAction,
  pt as calendarGrid,
  k as compareDates,
  ut as dateActionContext,
  L as differenceInDays,
  Q as editEndpoint,
  z as isInMonth,
  j as isWithinRange,
  yt as monthRelation,
  lt as moveRange,
  Z as nearestEndpoint,
  R as normalizeRange,
  At as selectDate,
  q as startOfMonth
};
