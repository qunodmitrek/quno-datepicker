import { jsx as p, jsxs as B } from "preact/jsx-runtime";
import { useState as $, useEffect as J, useMemo as mt, useRef as P } from "preact/hooks";
function at(t) {
  var e, n, a = "";
  if (typeof t == "string" || typeof t == "number") a += t;
  else if (typeof t == "object") if (Array.isArray(t)) {
    var d = t.length;
    for (e = 0; e < d; e++) t[e] && (n = at(t[e])) && (a && (a += " "), a += n);
  } else for (n in t) t[n] && (a && (a += " "), a += n);
  return a;
}
function E() {
  for (var t, e, n = 0, a = "", d = arguments.length; n < d; n++) (t = arguments[n]) && (e = at(t)) && (a && (a += " "), a += e);
  return a;
}
const yt = 864e5, z = (t) => t.toString().padStart(2, "0"), H = (t) => `${t.getUTCFullYear()}-${z(t.getUTCMonth() + 1)}-${z(
  t.getUTCDate()
)}`, L = (t) => {
  const [e, n, a] = t.split("-").map(Number);
  return new Date(Date.UTC(e, n - 1, a));
}, V = () => {
  const t = /* @__PURE__ */ new Date();
  return `${t.getFullYear()}-${z(t.getMonth() + 1)}-${z(
    t.getDate()
  )}`;
}, q = (t, e) => t.localeCompare(e), W = (t, e) => {
  const n = L(t);
  return n.setUTCDate(n.getUTCDate() + e), H(n);
}, K = (t, e) => Math.round((L(t).getTime() - L(e).getTime()) / yt), j = (t) => `${t.slice(0, 7)}-01`, rt = (t) => {
  const e = L(j(t));
  return e.setUTCMonth(e.getUTCMonth() + 1), e.setUTCDate(0), H(e);
}, ft = (t, e) => {
  const n = L(j(t));
  return n.setUTCMonth(n.getUTCMonth() + e), H(n);
}, ot = (t, e) => t.slice(0, 7) === e.slice(0, 7), Z = (t, e) => q(t, e) <= 0 ? { start: t, end: e } : { start: e, end: t }, it = (t, e) => {
  if (t.start === t.end)
    return q(e, t.start) < 0 ? "start" : "end";
  const n = Math.abs(K(e, t.start)), a = Math.abs(K(e, t.end));
  return n < a ? "start" : "end";
}, dt = (t, e, n) => {
  const a = e === "start" ? t.end : t.start, d = e === "start" ? q(n, a) > 0 : q(n, a) < 0;
  return {
    range: Z(n, a),
    endpoint: d ? e === "start" ? "end" : "start" : e
  };
}, kt = (t, e, n) => n === "single" ? { start: e, end: e } : dt(t, n, e).range, Dt = (t, e) => {
  const n = q(e, t.start) < 0 ? "start" : q(e, t.end) > 0 ? "end" : it(t, e);
  return {
    defaultAction: n,
    alternatives: [n === "start" ? "end" : "start", "single"]
  };
}, Wt = (t, e) => t ? dt(t, it(t, e), e).range : { start: e, end: e }, _t = (t, e, n) => {
  const a = K(n, e);
  return {
    start: W(t.start, a),
    end: W(t.end, a)
  };
}, bt = (t, e = 1) => {
  const n = L(j(t)), a = (n.getUTCDay() - e + 7) % 7, d = W(H(n), -a), u = L(rt(t)), o = ((e + 6) % 7 - u.getUTCDay() + 7) % 7, g = H(u), w = W(g, o), _ = (K(w, d) + 1) / 7, D = Math.max(6, _ + (w === g ? 1 : 0)) * 7;
  return Array.from(
    { length: D },
    (C, k) => W(d, k)
  );
}, I = (t, e) => q(t, e.start) >= 0 && q(t, e.end) <= 0, X = (t, e) => q(t, j(e)) < 0 ? "before" : q(t, rt(e)) > 0 ? "after" : "visible", wt = ({
  dates: t,
  visibleMonth: e,
  monthMotion: n,
  movingSelection: a,
  cycleDate: d,
  cyclePreview: u,
  selection: l,
  renderedSelection: o,
  config: g,
  onBegin: w,
  onEnter: _,
  onFinish: T
}) => {
  const { labels: D, formatters: C, locale: k, classNames: r, getDayCellProps: v } = g, s = V();
  return /* @__PURE__ */ p(
    "div",
    {
      className: E("quno-date-picker__grid", r == null ? void 0 : r.grid),
      "data-slot": "grid",
      "data-dragging": a ? "move" : void 0,
      "data-month-motion": n === -1 ? "previous" : n === 1 ? "next" : void 0,
      role: "grid",
      "aria-label": `${D.calendar}: ${C.month(
        e,
        k
      )}`,
      children: t.map((i, y) => {
        const f = ot(i, e), c = l ? I(i, l) : !1, b = o ? I(i, o) : !1, m = (o == null ? void 0 : o.start) === i, x = (o == null ? void 0 : o.end) === i, A = u ? I(i, u) : !1, G = A && (y % 7 === 0 || !u || !I(t[y - 1], u)), Q = A && (y % 7 === 6 || !u || !I(t[y + 1], u)), Y = L(
          i
        ).getUTCDay(), U = v == null ? void 0 : v({
          date: i,
          weekday: Y,
          isToday: i === s,
          isWeekend: Y === 0 || Y === 6,
          isOutside: !f,
          isSelected: b,
          isCommitted: c,
          isRangeStart: m,
          isRangeEnd: x
        });
        return /* @__PURE__ */ B(
          "button",
          {
            type: "button",
            role: "gridcell",
            className: E(
              "quno-date-picker__day",
              {
                "quno-date-picker__day--outside": !f,
                "quno-date-picker__day--selected": b,
                "quno-date-picker__day--committed": c,
                "quno-date-picker__day--start": m,
                "quno-date-picker__day--end": x
              },
              r == null ? void 0 : r.day,
              U == null ? void 0 : U.className
            ),
            style: U == null ? void 0 : U.style,
            title: U == null ? void 0 : U.title,
            "data-slot": "day",
            "data-date": i,
            "data-cycle-trigger": d === i ? "true" : void 0,
            "data-cycle-preview": A ? "true" : void 0,
            "data-cycle-preview-start": G ? "true" : void 0,
            "data-cycle-preview-end": Q ? "true" : void 0,
            "data-cycle-preview-range-start": (u == null ? void 0 : u.start) === i ? "true" : void 0,
            "data-cycle-preview-range-end": (u == null ? void 0 : u.end) === i ? "true" : void 0,
            "data-range-start": m ? "true" : void 0,
            "data-range-end": x ? "true" : void 0,
            "data-outside": f ? void 0 : "true",
            "data-selected": b ? "true" : void 0,
            "data-committed": c ? "true" : void 0,
            "aria-label": C.dayLabel(i, k),
            "aria-selected": c,
            onPointerDown: (O) => {
              O.preventDefault(), w(i);
            },
            onPointerEnter: () => _(i),
            onPointerUp: (O) => {
              O.preventDefault(), T(i);
            },
            children: [
              /* @__PURE__ */ p("span", { children: Number(i.slice(-2)) }),
              (m || x) && /* @__PURE__ */ p(
                "i",
                {
                  className: E(
                    "quno-date-picker__handle",
                    r == null ? void 0 : r.handle
                  ),
                  "data-slot": "handle",
                  "aria-hidden": "true"
                }
              )
            ]
          },
          i
        );
      })
    }
  );
}, tt = ({ direction: t }) => /* @__PURE__ */ p("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", focusable: "false", children: /* @__PURE__ */ p(
  "path",
  {
    d: t === -1 ? "M10 3.5 5.5 8 10 12.5" : "M6 3.5 10.5 8 6 12.5",
    fill: "none",
    stroke: "currentColor",
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    "stroke-width": "1.6"
  }
) }), Tt = ({
  visibleMonth: t,
  monthMotion: e,
  config: n,
  onNavigate: a
}) => {
  const { labels: d, formatters: u, locale: l, classNames: o } = n;
  return /* @__PURE__ */ B(
    "div",
    {
      className: E(
        "quno-date-picker__month-header",
        o == null ? void 0 : o.monthHeader
      ),
      "data-slot": "month-header",
      children: [
        /* @__PURE__ */ p(
          "button",
          {
            type: "button",
            className: o == null ? void 0 : o.previousButton,
            "data-slot": "previous-button",
            "aria-label": d.previousMonth,
            onClick: () => a(-1),
            children: /* @__PURE__ */ p(tt, { direction: -1 })
          }
        ),
        /* @__PURE__ */ p(
          "h2",
          {
            className: o == null ? void 0 : o.monthHeading,
            "data-slot": "month-heading",
            "data-month-motion": e === -1 ? "previous" : e === 1 ? "next" : void 0,
            children: /* @__PURE__ */ p("span", { children: u.month(t, l) }, t)
          }
        ),
        /* @__PURE__ */ p(
          "button",
          {
            type: "button",
            className: o == null ? void 0 : o.nextButton,
            "data-slot": "next-button",
            "aria-label": d.nextMonth,
            onClick: () => a(1),
            children: /* @__PURE__ */ p(tt, { direction: 1 })
          }
        )
      ]
    }
  );
}, et = (t, e) => {
  const n = t == null ? void 0 : t.closest(
    "[data-day-index]"
  );
  return e.indexOf(Number(n == null ? void 0 : n.dataset.dayIndex));
}, Ct = ({ controller: t, config: e }) => {
  const [n, a] = $({ type: "weekdays" }), { classNames: d, formatters: u, locale: l } = e, { interaction: o, renderedSelection: g, weekdays: w } = t, _ = o.type !== "idle", T = V(), D = Array.from(
    { length: 7 },
    (r, v) => W(t.gridDates[0], v - 7)
  );
  J(() => {
    _ || a({ type: "weekdays" });
  }, [_]);
  const C = (r) => {
    !_ || r < 0 || (a({ type: "previous-dates", pointerIndex: r }), t.enterDay(D[r]));
  }, k = (r) => {
    a({ type: "weekdays" }), t.finishDrag(r);
  };
  return /* @__PURE__ */ p(
    "div",
    {
      className: E("quno-date-picker__weekdays", d == null ? void 0 : d.weekdays),
      "data-slot": "weekdays",
      "data-drag-overflow": n.type === "previous-dates" ? "previous" : void 0,
      "data-drag-active": _ ? "true" : void 0,
      "aria-hidden": "true",
      onPointerEnter: (r) => C(et(r.target, w)),
      onPointerLeave: () => a({ type: "weekdays" }),
      onPointerUp: (r) => {
        if (!_) return;
        const v = et(r.target, w);
        v < 0 || (r.preventDefault(), k(D[v]));
      },
      children: w.map((r, v) => {
        var x;
        const s = D[v], i = g ? I(s, g) : !1;
        if (!(n.type === "previous-dates" && (i || v === n.pointerIndex)))
          return /* @__PURE__ */ p(
            "span",
            {
              className: d == null ? void 0 : d.weekday,
              "data-slot": "weekday",
              "data-day-index": r,
              onPointerEnter: () => C(v),
              children: u.weekday(r, l)
            },
            r
          );
        const f = (g == null ? void 0 : g.start) === s, c = (g == null ? void 0 : g.end) === s, b = t.selection ? I(s, t.selection) : !1, m = (x = e.getDayCellProps) == null ? void 0 : x.call(e, {
          date: s,
          weekday: r,
          isToday: s === T,
          isWeekend: r === 0 || r === 6,
          isOutside: !0,
          isSelected: i,
          isCommitted: b,
          isRangeStart: f,
          isRangeEnd: c
        });
        return /* @__PURE__ */ p(
          "span",
          {
            className: E(
              "quno-date-picker__day",
              "quno-date-picker__day--outside",
              "quno-date-picker__overflow-day",
              i && "quno-date-picker__day--selected",
              f && "quno-date-picker__day--start",
              c && "quno-date-picker__day--end",
              d == null ? void 0 : d.day,
              d == null ? void 0 : d.overflowDay,
              m == null ? void 0 : m.className
            ),
            style: m == null ? void 0 : m.style,
            title: m == null ? void 0 : m.title,
            "data-slot": "overflow-day",
            "data-day-index": r,
            "data-date": s,
            "data-selected": i ? "true" : void 0,
            "data-range-start": f ? "true" : void 0,
            "data-range-end": c ? "true" : void 0,
            "data-outside": "true",
            onPointerEnter: () => C(v),
            onPointerUp: (A) => {
              A.preventDefault(), A.stopPropagation(), k(s);
            },
            children: /* @__PURE__ */ p("span", { children: Number(s.slice(-2)) })
          },
          r
        );
      })
    }
  );
}, Et = ({ controller: t, config: e }) => {
  const { classNames: n } = e, a = t.interaction.type === "drag-range" || t.interaction.type === "drag-endpoint";
  return /* @__PURE__ */ B(
    "div",
    {
      className: E("quno-date-picker__calendar-shell", n == null ? void 0 : n.calendar),
      "data-slot": "calendar",
      "data-dragging": a ? "move" : void 0,
      children: [
        ["previous", "next"].map((d) => /* @__PURE__ */ p(
          "div",
          {
            className: E(
              "quno-date-picker__edge",
              `quno-date-picker__edge--${d}`,
              n == null ? void 0 : n.edge
            ),
            "data-slot": "edge",
            "data-direction": d,
            "aria-hidden": "true",
            onPointerEnter: () => t.startEdgeNavigation(d === "previous" ? -1 : 1),
            onPointerLeave: t.stopEdgeNavigation
          },
          d
        )),
        /* @__PURE__ */ p(
          Tt,
          {
            visibleMonth: t.visibleMonth,
            monthMotion: t.monthMotion,
            config: e,
            onNavigate: t.navigate
          }
        ),
        /* @__PURE__ */ p(Ct, { controller: t, config: e }),
        /* @__PURE__ */ p(
          wt,
          {
            dates: t.gridDates,
            visibleMonth: t.visibleMonth,
            monthMotion: t.monthMotion,
            movingSelection: a,
            cycleDate: t.cycleDate,
            cyclePreview: t.cyclePreview,
            selection: t.selection,
            renderedSelection: t.renderedSelection,
            config: e,
            onBegin: t.beginDrag,
            onEnter: t.enterDay,
            onFinish: t.finishDrag
          },
          t.visibleMonth
        )
      ]
    }
  );
}, Mt = (t, e) => new Intl.DateTimeFormat(e, {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC"
}).format(/* @__PURE__ */ new Date(`${t}T00:00:00Z`)), qt = (t, e) => new Intl.DateTimeFormat(e, {
  month: "long",
  year: "numeric",
  timeZone: "UTC"
}).format(/* @__PURE__ */ new Date(`${t}T00:00:00Z`)), xt = (t, e) => new Intl.DateTimeFormat(e, {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC"
}).format(/* @__PURE__ */ new Date(`${t}T00:00:00Z`)), Ut = (t, e) => new Intl.DateTimeFormat(e, {
  weekday: "short",
  timeZone: "UTC"
}).format(new Date(Date.UTC(2026, 7, 2 + t))), At = {
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
  hint: "Click again to cycle a date role, or drag outside the period to paint a new one."
}, Rt = {
  date: Mt,
  month: qt,
  dayLabel: xt,
  weekday: Ut
}, nt = ({
  selection: t,
  visibleMonth: e,
  position: n,
  monthChangeSource: a,
  config: d,
  onJump: u
}) => {
  const l = mt(
    () => t ? [
      { endpoint: "start", date: t.start },
      { endpoint: "end", date: t.end }
    ].filter(
      ({ date: s }) => X(s, e) === n
    ) : [],
    [n, t, e]
  ), [o, g] = $(
    () => l.map((s) => ({
      ...s,
      phase: "entering",
      calendarReveal: "moving"
    }))
  ), w = P(null), _ = P(e);
  J(() => {
    const s = _.current !== e && a === "navigation" ? "stationary" : "moving";
    _.current = e, g((i) => {
      const y = i.map((c) => {
        const b = l.find(
          ({ endpoint: m }) => m === c.endpoint
        );
        return b ? {
          ...b,
          phase: c.phase === "exiting" ? "entering" : c.phase,
          calendarReveal: c.phase === "exiting" ? s : c.calendarReveal
        } : { ...c, phase: "exiting" };
      }), f = l.filter(
        ({ endpoint: c }) => !i.some((b) => b.endpoint === c)
      ).map((c) => ({
        ...c,
        phase: "entering",
        calendarReveal: s
      }));
      return [...y, ...f];
    });
  }, [l, a, e]);
  const T = o.map(({ endpoint: s, phase: i }) => `${s}:${i}`).join("|");
  if (J(() => {
    var y;
    const s = (y = w.current) == null ? void 0 : y.querySelector(
      '[data-item-presence="entering"], [data-item-presence="exiting"]'
    );
    if (!s) return;
    const i = window.getComputedStyle(s).animationName;
    (!i || i === "none") && g(
      (f) => f.flatMap(
        (c) => c.phase === "exiting" ? [] : [{ ...c, phase: "visible" }]
      )
    );
  }, [T]), !o.length) return null;
  const D = o.every(({ phase: s }) => s === "exiting") ? "exiting" : o.some(({ phase: s }) => s === "visible") ? "visible" : "entering", { labels: C, formatters: k, locale: r, classNames: v } = d;
  return /* @__PURE__ */ p(
    "div",
    {
      ref: w,
      className: E(
        "quno-date-picker__pills",
        `quno-date-picker__pills--${n}`,
        v == null ? void 0 : v.pills
      ),
      "data-slot": "pills",
      "data-position": n,
      "data-presence": D,
      "data-calendar-reveal": o.some(
        ({ phase: s, calendarReveal: i }) => s === "entering" && i === "stationary"
      ) ? "stationary" : void 0,
      "aria-hidden": D === "exiting" || void 0,
      children: /* @__PURE__ */ p("div", { className: "quno-date-picker__pills-track", children: o.map(({ endpoint: s, date: i, phase: y }) => /* @__PURE__ */ B(
        "button",
        {
          type: "button",
          className: E("quno-date-picker__pill", v == null ? void 0 : v.pill),
          "data-slot": "pill",
          "data-endpoint": s,
          "data-position": n,
          "data-item-presence": y,
          "aria-hidden": y === "exiting" || void 0,
          disabled: y === "exiting",
          onClick: () => u(i),
          onAnimationEnd: () => {
            g(
              (f) => f.flatMap((c) => c.endpoint !== s || c.phase !== y ? [c] : y === "entering" ? [{ ...c, phase: "visible" }] : [])
            );
          },
          children: [
            /* @__PURE__ */ p("span", { children: s === "start" ? C.start : C.end }),
            k.date(i, r),
            /* @__PURE__ */ p("span", { "aria-hidden": "true", children: n === "before" ? "↑" : "↓" })
          ]
        },
        s
      )) })
    }
  );
}, St = ({
  selection: t,
  config: e,
  onClear: n
}) => {
  const { labels: a, formatters: d, locale: u, classNames: l } = e, o = t ? t.start === t.end ? d.date(t.start, u) : `${d.date(t.start, u)} – ${d.date(
    t.end,
    u
  )}` : a.chooseDate;
  return /* @__PURE__ */ B(
    "header",
    {
      className: E(
        "quno-date-picker__selection-header",
        l == null ? void 0 : l.selectionHeader
      ),
      "data-slot": "selection-header",
      children: [
        /* @__PURE__ */ B("div", { children: [
          /* @__PURE__ */ p(
            "span",
            {
              className: E(
                "quno-date-picker__eyebrow",
                l == null ? void 0 : l.selectionEyebrow
              ),
              "data-slot": "selection-eyebrow",
              children: a.selectedPeriod
            }
          ),
          /* @__PURE__ */ p(
            "strong",
            {
              className: l == null ? void 0 : l.selectionSummary,
              "data-slot": "selection-summary",
              children: o
            }
          )
        ] }),
        /* @__PURE__ */ p(
          "button",
          {
            type: "button",
            className: E("quno-date-picker__clear", l == null ? void 0 : l.clearButton),
            "data-slot": "clear-button",
            disabled: !t,
            onClick: n,
            children: a.clear
          }
        )
      ]
    }
  );
}, F = () => ({ type: "idle" }), $t = (t, e, n) => ({
  type: "drag-endpoint",
  endpoint: e,
  origin: n,
  anchor: e === "start" ? t.end : t.start,
  current: t,
  moved: !1
}), It = (t, e) => {
  if (!t)
    return {
      type: "create",
      origin: e,
      current: { start: e, end: e },
      moved: !1
    };
  const n = e === t.start ? "start" : e === t.end ? "end" : null;
  return n ? $t(t, n, e) : I(e, t) ? {
    type: "drag-range",
    origin: e,
    original: t,
    current: t,
    moved: !1
  } : {
    type: "paint-pending",
    origin: e,
    original: t,
    current: t,
    moved: !1
  };
}, st = (t, e) => t.type === "idle" ? t : t.type === "create" ? {
  ...t,
  current: Z(t.origin, e),
  moved: t.moved || e !== t.origin
} : t.type === "paint-pending" ? e === t.origin ? t : {
  type: "create",
  origin: t.origin,
  current: Z(t.origin, e),
  moved: !0
} : t.type === "drag-range" ? {
  ...t,
  current: _t(t.original, t.origin, e),
  moved: t.moved || e !== t.origin
} : {
  ...t,
  endpoint: q(e, t.anchor) <= 0 ? "start" : "end",
  current: Z(t.anchor, e),
  moved: t.moved || e !== t.origin
}, N = (t) => {
  for (let e = t.index + 1; e < t.actions.length; e += 1) {
    const n = kt(
      t.original,
      t.date,
      t.actions[e]
    );
    if (n.start !== t.value.start || n.end !== t.value.end)
      return { cycle: e === t.actions.length - 1 ? null : { ...t, index: e, value: n }, value: n, changed: !0 };
  }
  return { cycle: null, value: t.value, changed: !1 };
}, Ft = (t, e) => {
  if (t.type === "idle")
    return { interaction: t };
  if (t.type === "paint-pending" && e !== t.origin)
    return {
      interaction: F(),
      value: Z(t.origin, e)
    };
  if (t.moved) {
    const o = st(t, e);
    return o.type === "idle" ? { interaction: o } : { interaction: F(), value: o.current };
  }
  if (t.type === "create")
    return { interaction: F(), value: { start: e, end: e } };
  const n = t.type === "paint-pending" ? t.original : t.current, a = Dt(n, e), d = a.defaultAction === "start" ? "end" : "start", u = [
    a.defaultAction,
    d,
    "single"
  ], l = N({
    date: e,
    original: n,
    actions: u,
    index: -1,
    value: n
  });
  return {
    interaction: F(),
    value: l.changed ? l.value : void 0,
    cycle: l.cycle ?? void 0
  };
}, Lt = ({
  value: t,
  defaultValue: e,
  initialMonth: n,
  weekStartsOn: a,
  autoNavigateDelay: d,
  autoNavigateRepeatDelay: u,
  onChange: l,
  onVisibleMonthChange: o
}) => {
  const g = t !== void 0, [w, _] = $(e), T = g ? t ?? null : w, [D, C] = $(
    j(n ?? (T == null ? void 0 : T.start) ?? V())
  ), [k, r] = $(null), [v, s] = $(null), [i, y] = $(F()), [f, c] = $(null), b = P(null), m = () => {
    b.current !== null && (window.clearTimeout(b.current), b.current = null);
  };
  J(() => m, []);
  const x = (h) => {
    g || _(h), l == null || l(h);
  }, A = (h, M = null, R = "interaction") => {
    r(M), s(R), C(h), o == null || o(h);
  }, G = (h, M) => {
    r(h), s(M), C((R) => {
      const S = ft(R, h);
      return o == null || o(S), S;
    }), c(null);
  }, Q = (h) => G(h, "navigation"), U = (i.type === "idle" ? null : i.current) ?? T, O = (f == null ? void 0 : f.date) ?? null, lt = f ? N(f).value : null, ct = (h) => {
    m(), y(It(T, h));
  }, ut = (h) => {
    y((M) => st(M, h));
  }, pt = (h) => {
    if (m(), (f == null ? void 0 : f.date) === h && i.type !== "idle" && !i.moved) {
      const S = N(f);
      c(S.cycle), y(F()), S.changed && x(S.value);
      return;
    }
    const R = Ft(i, h);
    if (y(R.interaction), c(R.cycle ?? null), R.value && x(R.value), !ot(h, D)) {
      const S = q(h, D) < 0 ? -1 : 1;
      A(j(h), S, "interaction");
    }
  }, gt = (h) => {
    if (i.type === "idle") return;
    m();
    const M = () => {
      G(h, "interaction"), b.current = window.setTimeout(M, u);
    };
    b.current = window.setTimeout(M, d);
  }, ht = () => {
    m(), y(F()), c(null), x(null);
  }, vt = (h) => {
    m(), y(F()), c(null);
    const M = q(h, D) < 0 ? -1 : 1;
    A(j(h), M, "endpoint");
  };
  return {
    selection: T,
    renderedSelection: U,
    cycleDate: O,
    cyclePreview: lt,
    visibleMonth: D,
    monthMotion: k,
    monthChangeSource: v,
    interaction: i,
    gridDates: bt(D, a),
    weekdays: Array.from({ length: 7 }, (h, M) => (a + M) % 7),
    beginDrag: ct,
    enterDay: ut,
    finishDrag: pt,
    clear: ht,
    navigate: Q,
    startEdgeNavigation: gt,
    stopEdgeNavigation: m,
    jumpToEndpoint: vt
  };
}, Ot = ({
  value: t,
  defaultValue: e = null,
  initialMonth: n,
  locale: a = "en-GB",
  labels: d,
  formatters: u,
  weekStartsOn: l = 1,
  className: o,
  classNames: g,
  getDayCellProps: w,
  autoNavigateDelay: _ = 400,
  autoNavigateRepeatDelay: T = 650,
  onChange: D,
  onVisibleMonthChange: C
}) => {
  const k = {
    locale: a,
    labels: { ...At, ...d },
    formatters: { ...Rt, ...u },
    classNames: g,
    getDayCellProps: w
  }, r = Lt({
    value: t,
    defaultValue: e,
    initialMonth: n,
    weekStartsOn: l,
    autoNavigateDelay: _,
    autoNavigateRepeatDelay: T,
    onChange: D,
    onVisibleMonthChange: C
  }), v = r.selection ? [
    X(r.selection.start, r.visibleMonth),
    X(r.selection.end, r.visibleMonth)
  ] : [];
  return /* @__PURE__ */ B(
    "section",
    {
      className: E("quno-date-picker", o, g == null ? void 0 : g.root),
      "data-slot": "root",
      "data-pill-before": v.includes("before") || void 0,
      "data-pill-after": v.includes("after") || void 0,
      "aria-label": k.labels.calendar,
      onPointerUp: r.stopEdgeNavigation,
      children: [
        /* @__PURE__ */ p(
          St,
          {
            selection: r.selection,
            config: k,
            onClear: r.clear
          }
        ),
        /* @__PURE__ */ p(
          nt,
          {
            selection: r.selection,
            visibleMonth: r.visibleMonth,
            position: "before",
            monthChangeSource: r.monthChangeSource,
            config: k,
            onJump: r.jumpToEndpoint
          }
        ),
        /* @__PURE__ */ p(Et, { controller: r, config: k }),
        /* @__PURE__ */ p(
          nt,
          {
            selection: r.selection,
            visibleMonth: r.visibleMonth,
            position: "after",
            monthChangeSource: r.monthChangeSource,
            config: k,
            onJump: r.jumpToEndpoint
          }
        ),
        k.labels.hint && /* @__PURE__ */ p(
          "p",
          {
            className: E("quno-date-picker__hint", g == null ? void 0 : g.hint),
            "data-slot": "hint",
            children: k.labels.hint
          }
        )
      ]
    }
  );
};
export {
  Ot as QunoDatePicker,
  W as addDays,
  ft as addMonths,
  kt as applyDateAction,
  bt as calendarGrid,
  q as compareDates,
  Dt as dateActionContext,
  K as differenceInDays,
  dt as editEndpoint,
  ot as isInMonth,
  I as isWithinRange,
  X as monthRelation,
  _t as moveRange,
  it as nearestEndpoint,
  Z as normalizeRange,
  Wt as selectDate,
  j as startOfMonth
};
