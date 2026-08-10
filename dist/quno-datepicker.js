import { jsx as c, jsxs as S } from "preact/jsx-runtime";
import { useState as I, useEffect as W, useMemo as ut, useRef as Q } from "preact/hooks";
function X(t) {
  var e, n, r = "";
  if (typeof t == "string" || typeof t == "number") r += t;
  else if (typeof t == "object") if (Array.isArray(t)) {
    var i = t.length;
    for (e = 0; e < i; e++) t[e] && (n = X(t[e])) && (r && (r += " "), r += n);
  } else for (n in t) t[n] && (r && (r += " "), r += n);
  return r;
}
function T() {
  for (var t, e, n = 0, r = "", i = arguments.length; n < i; n++) (t = arguments[n]) && (e = X(t)) && (r && (r += " "), r += e);
  return r;
}
const pt = 864e5, O = (t) => t.toString().padStart(2, "0"), j = (t) => `${t.getUTCFullYear()}-${O(t.getUTCMonth() + 1)}-${O(
  t.getUTCDate()
)}`, A = (t) => {
  const [e, n, r] = t.split("-").map(Number);
  return new Date(Date.UTC(e, n - 1, r));
}, Y = () => {
  const t = /* @__PURE__ */ new Date();
  return `${t.getFullYear()}-${O(t.getMonth() + 1)}-${O(
    t.getDate()
  )}`;
}, E = (t, e) => t.localeCompare(e), P = (t, e) => {
  const n = A(t);
  return n.setUTCDate(n.getUTCDate() + e), j(n);
}, Z = (t, e) => Math.round((A(t).getTime() - A(e).getTime()) / pt), R = (t) => `${t.slice(0, 7)}-01`, N = (t) => {
  const e = A(R(t));
  return e.setUTCMonth(e.getUTCMonth() + 1), e.setUTCDate(0), j(e);
}, gt = (t, e) => {
  const n = A(R(t));
  return n.setUTCMonth(n.getUTCMonth() + e), j(n);
}, V = (t, e) => t.slice(0, 7) === e.slice(0, 7), L = (t, e) => E(t, e) <= 0 ? { start: t, end: e } : { start: e, end: t }, tt = (t, e) => {
  if (t.start === t.end)
    return E(e, t.start) < 0 ? "start" : "end";
  const n = Math.abs(Z(e, t.start)), r = Math.abs(Z(e, t.end));
  return n < r ? "start" : "end";
}, et = (t, e, n) => {
  const r = e === "start" ? t.end : t.start, i = e === "start" ? E(n, r) > 0 : E(n, r) < 0;
  return {
    range: L(n, r),
    endpoint: i ? e === "start" ? "end" : "start" : e
  };
}, ht = (t, e, n) => n === "single" ? { start: e, end: e } : et(t, n, e).range, vt = (t, e) => {
  const n = E(e, t.start) < 0 ? "start" : E(e, t.end) > 0 ? "end" : tt(t, e);
  return {
    defaultAction: n,
    alternatives: [n === "start" ? "end" : "start", "single"]
  };
}, St = (t, e) => t ? et(t, tt(t, e), e).range : { start: e, end: e }, yt = (t, e, n) => {
  const r = Z(n, e);
  return {
    start: P(t.start, r),
    end: P(t.end, r)
  };
}, ft = (t, e = 1) => {
  const n = A(R(t)), r = (n.getUTCDay() - e + 7) % 7, i = P(j(n), -r), u = A(N(t)), d = ((e + 6) % 7 - u.getUTCDay() + 7) % 7, p = j(u), M = P(p, d), _ = (Z(M, i) + 1) / 7, k = Math.max(6, _ + (M === p ? 1 : 0)) * 7;
  return Array.from(
    { length: k },
    (m, h) => P(i, h)
  );
}, B = (t, e) => E(t, e.start) >= 0 && E(t, e.end) <= 0, G = (t, e) => E(t, R(e)) < 0 ? "before" : E(t, N(e)) > 0 ? "after" : "visible", mt = ({
  dates: t,
  visibleMonth: e,
  monthMotion: n,
  movingSelection: r,
  selection: i,
  renderedSelection: u,
  config: s,
  onBegin: d,
  onEnter: p,
  onFinish: M
}) => {
  const { labels: _, formatters: D, locale: k, classNames: m, getDayCellProps: h } = s, a = Y();
  return /* @__PURE__ */ c(
    "div",
    {
      className: T("quno-date-picker__grid", m == null ? void 0 : m.grid),
      "data-slot": "grid",
      "data-dragging": r ? "move" : void 0,
      "data-month-motion": n === -1 ? "previous" : n === 1 ? "next" : void 0,
      role: "grid",
      "aria-label": `${_.calendar}: ${D.month(
        e,
        k
      )}`,
      children: t.map((o) => {
        const l = V(o, e), g = i ? B(o, i) : !1, y = u ? B(o, u) : !1, b = (u == null ? void 0 : u.start) === o, w = (u == null ? void 0 : u.end) === o, x = A(
          o
        ).getUTCDay(), f = h == null ? void 0 : h({
          date: o,
          weekday: x,
          isToday: o === a,
          isWeekend: x === 0 || x === 6,
          isOutside: !l,
          isSelected: y,
          isCommitted: g,
          isRangeStart: b,
          isRangeEnd: w
        });
        return /* @__PURE__ */ S(
          "button",
          {
            type: "button",
            role: "gridcell",
            className: T(
              "quno-date-picker__day",
              {
                "quno-date-picker__day--outside": !l,
                "quno-date-picker__day--selected": y,
                "quno-date-picker__day--committed": g,
                "quno-date-picker__day--start": b,
                "quno-date-picker__day--end": w
              },
              m == null ? void 0 : m.day,
              f == null ? void 0 : f.className
            ),
            style: f == null ? void 0 : f.style,
            title: f == null ? void 0 : f.title,
            "data-slot": "day",
            "data-date": o,
            "data-range-start": b ? "true" : void 0,
            "data-range-end": w ? "true" : void 0,
            "data-outside": l ? void 0 : "true",
            "data-selected": y ? "true" : void 0,
            "data-committed": g ? "true" : void 0,
            "aria-label": D.dayLabel(o, k),
            "aria-selected": g,
            onPointerDown: (q) => {
              q.preventDefault(), d(o);
            },
            onPointerEnter: () => p(o),
            onPointerUp: (q) => {
              q.preventDefault(), M(o);
            },
            children: [
              /* @__PURE__ */ c("span", { children: Number(o.slice(-2)) }),
              (b || w) && /* @__PURE__ */ c(
                "i",
                {
                  className: T(
                    "quno-date-picker__handle",
                    m == null ? void 0 : m.handle
                  ),
                  "data-slot": "handle",
                  "aria-hidden": "true"
                }
              )
            ]
          },
          o
        );
      })
    }
  );
}, J = ({ direction: t }) => /* @__PURE__ */ c("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", focusable: "false", children: /* @__PURE__ */ c(
  "path",
  {
    d: t === -1 ? "M10 3.5 5.5 8 10 12.5" : "M6 3.5 10.5 8 6 12.5",
    fill: "none",
    stroke: "currentColor",
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    "stroke-width": "1.6"
  }
) }), kt = ({
  visibleMonth: t,
  monthMotion: e,
  config: n,
  onNavigate: r
}) => {
  const { labels: i, formatters: u, locale: s, classNames: d } = n;
  return /* @__PURE__ */ S(
    "div",
    {
      className: T(
        "quno-date-picker__month-header",
        d == null ? void 0 : d.monthHeader
      ),
      "data-slot": "month-header",
      children: [
        /* @__PURE__ */ c(
          "button",
          {
            type: "button",
            className: d == null ? void 0 : d.previousButton,
            "data-slot": "previous-button",
            "aria-label": i.previousMonth,
            onClick: () => r(-1),
            children: /* @__PURE__ */ c(J, { direction: -1 })
          }
        ),
        /* @__PURE__ */ c(
          "h2",
          {
            className: d == null ? void 0 : d.monthHeading,
            "data-slot": "month-heading",
            "data-month-motion": e === -1 ? "previous" : e === 1 ? "next" : void 0,
            children: /* @__PURE__ */ c("span", { children: u.month(t, s) }, t)
          }
        ),
        /* @__PURE__ */ c(
          "button",
          {
            type: "button",
            className: d == null ? void 0 : d.nextButton,
            "data-slot": "next-button",
            "aria-label": i.nextMonth,
            onClick: () => r(1),
            children: /* @__PURE__ */ c(J, { direction: 1 })
          }
        )
      ]
    }
  );
}, z = (t, e) => {
  const n = t == null ? void 0 : t.closest(
    "[data-day-index]"
  );
  return e.indexOf(Number(n == null ? void 0 : n.dataset.dayIndex));
}, Dt = ({ controller: t, config: e }) => {
  const [n, r] = I({ type: "weekdays" }), { classNames: i, formatters: u, locale: s } = e, { interaction: d, renderedSelection: p, weekdays: M } = t, _ = d.type !== "idle", D = Y(), k = Array.from(
    { length: 7 },
    (a, o) => P(t.gridDates[0], o - 7)
  );
  W(() => {
    _ || r({ type: "weekdays" });
  }, [_]);
  const m = (a) => {
    !_ || a < 0 || (r({ type: "previous-dates", pointerIndex: a }), t.enterDay(k[a]));
  }, h = (a) => {
    r({ type: "weekdays" }), t.finishDrag(a);
  };
  return /* @__PURE__ */ c(
    "div",
    {
      className: T("quno-date-picker__weekdays", i == null ? void 0 : i.weekdays),
      "data-slot": "weekdays",
      "data-drag-overflow": n.type === "previous-dates" ? "previous" : void 0,
      "data-drag-active": _ ? "true" : void 0,
      "aria-hidden": "true",
      onPointerEnter: (a) => m(z(a.target, M)),
      onPointerLeave: () => r({ type: "weekdays" }),
      onPointerUp: (a) => {
        if (!_) return;
        const o = z(a.target, M);
        o < 0 || (a.preventDefault(), h(k[o]));
      },
      children: M.map((a, o) => {
        var q;
        const l = k[o], g = p ? B(l, p) : !1;
        if (!(n.type === "previous-dates" && (g || o === n.pointerIndex)))
          return /* @__PURE__ */ c(
            "span",
            {
              className: i == null ? void 0 : i.weekday,
              "data-slot": "weekday",
              "data-day-index": a,
              onPointerEnter: () => m(o),
              children: u.weekday(a, s)
            },
            a
          );
        const b = (p == null ? void 0 : p.start) === l, w = (p == null ? void 0 : p.end) === l, x = t.selection ? B(l, t.selection) : !1, f = (q = e.getDayCellProps) == null ? void 0 : q.call(e, {
          date: l,
          weekday: a,
          isToday: l === D,
          isWeekend: a === 0 || a === 6,
          isOutside: !0,
          isSelected: g,
          isCommitted: x,
          isRangeStart: b,
          isRangeEnd: w
        });
        return /* @__PURE__ */ c(
          "span",
          {
            className: T(
              "quno-date-picker__day",
              "quno-date-picker__day--outside",
              "quno-date-picker__overflow-day",
              g && "quno-date-picker__day--selected",
              b && "quno-date-picker__day--start",
              w && "quno-date-picker__day--end",
              i == null ? void 0 : i.day,
              i == null ? void 0 : i.overflowDay,
              f == null ? void 0 : f.className
            ),
            style: f == null ? void 0 : f.style,
            title: f == null ? void 0 : f.title,
            "data-slot": "overflow-day",
            "data-day-index": a,
            "data-date": l,
            "data-selected": g ? "true" : void 0,
            "data-range-start": b ? "true" : void 0,
            "data-range-end": w ? "true" : void 0,
            "data-outside": "true",
            onPointerEnter: () => m(o),
            onPointerUp: (H) => {
              H.preventDefault(), H.stopPropagation(), h(l);
            },
            children: /* @__PURE__ */ c("span", { children: Number(l.slice(-2)) })
          },
          a
        );
      })
    }
  );
}, _t = ({ controller: t, config: e }) => {
  const { classNames: n } = e, r = t.interaction.type === "drag-range" || t.interaction.type === "drag-endpoint";
  return /* @__PURE__ */ S(
    "div",
    {
      className: T("quno-date-picker__calendar-shell", n == null ? void 0 : n.calendar),
      "data-slot": "calendar",
      "data-dragging": r ? "move" : void 0,
      children: [
        ["previous", "next"].map((i) => /* @__PURE__ */ c(
          "div",
          {
            className: T(
              "quno-date-picker__edge",
              `quno-date-picker__edge--${i}`,
              n == null ? void 0 : n.edge
            ),
            "data-slot": "edge",
            "data-direction": i,
            "aria-hidden": "true",
            onPointerEnter: () => t.startEdgeNavigation(i === "previous" ? -1 : 1),
            onPointerLeave: t.stopEdgeNavigation
          },
          i
        )),
        /* @__PURE__ */ c(
          kt,
          {
            visibleMonth: t.visibleMonth,
            monthMotion: t.monthMotion,
            config: e,
            onNavigate: t.navigate
          }
        ),
        /* @__PURE__ */ c(Dt, { controller: t, config: e }),
        /* @__PURE__ */ c(
          mt,
          {
            dates: t.gridDates,
            visibleMonth: t.visibleMonth,
            monthMotion: t.monthMotion,
            movingSelection: r,
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
}, bt = (t, e) => new Intl.DateTimeFormat(e, {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC"
}).format(/* @__PURE__ */ new Date(`${t}T00:00:00Z`)), wt = (t, e) => new Intl.DateTimeFormat(e, {
  month: "long",
  year: "numeric",
  timeZone: "UTC"
}).format(/* @__PURE__ */ new Date(`${t}T00:00:00Z`)), Tt = (t, e) => new Intl.DateTimeFormat(e, {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC"
}).format(/* @__PURE__ */ new Date(`${t}T00:00:00Z`)), Mt = (t, e) => new Intl.DateTimeFormat(e, {
  weekday: "short",
  timeZone: "UTC"
}).format(new Date(Date.UTC(2026, 7, 2 + t))), Ct = {
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
}, Et = {
  date: bt,
  month: wt,
  dayLabel: Tt,
  weekday: Mt
}, K = ({
  selection: t,
  visibleMonth: e,
  position: n,
  config: r,
  onJump: i
}) => {
  const u = ut(
    () => t ? [
      { endpoint: "start", date: t.start },
      { endpoint: "end", date: t.end }
    ].filter(
      ({ date: a }) => G(a, e) === n
    ) : [],
    [n, t, e]
  ), [s, d] = I(
    () => u.map((a) => ({ ...a, phase: "entering" }))
  ), p = Q(null);
  W(() => {
    d((a) => {
      const o = a.map((g) => {
        const y = u.find(
          ({ endpoint: b }) => b === g.endpoint
        );
        return y ? {
          ...y,
          phase: g.phase === "exiting" ? "entering" : g.phase
        } : { ...g, phase: "exiting" };
      }), l = u.filter(
        ({ endpoint: g }) => !a.some((y) => y.endpoint === g)
      ).map((g) => ({ ...g, phase: "entering" }));
      return [...o, ...l];
    });
  }, [u]);
  const M = s.map(({ endpoint: a, phase: o }) => `${a}:${o}`).join("|");
  if (W(() => {
    var l;
    const a = (l = p.current) == null ? void 0 : l.querySelector(
      '[data-item-presence="entering"], [data-item-presence="exiting"]'
    );
    if (!a) return;
    const o = window.getComputedStyle(a).animationName;
    (!o || o === "none") && d(
      (g) => g.flatMap(
        (y) => y.phase === "exiting" ? [] : [{ ...y, phase: "visible" }]
      )
    );
  }, [M]), !s.length) return null;
  const _ = s.every(({ phase: a }) => a === "exiting") ? "exiting" : s.some(({ phase: a }) => a === "visible") ? "visible" : "entering", { labels: D, formatters: k, locale: m, classNames: h } = r;
  return /* @__PURE__ */ c(
    "div",
    {
      ref: p,
      className: T(
        "quno-date-picker__pills",
        `quno-date-picker__pills--${n}`,
        h == null ? void 0 : h.pills
      ),
      "data-slot": "pills",
      "data-position": n,
      "data-presence": _,
      "aria-hidden": _ === "exiting" || void 0,
      children: /* @__PURE__ */ c("div", { className: "quno-date-picker__pills-track", children: s.map(({ endpoint: a, date: o, phase: l }) => /* @__PURE__ */ S(
        "button",
        {
          type: "button",
          className: T("quno-date-picker__pill", h == null ? void 0 : h.pill),
          "data-slot": "pill",
          "data-endpoint": a,
          "data-position": n,
          "data-item-presence": l,
          "aria-hidden": l === "exiting" || void 0,
          disabled: l === "exiting",
          onClick: () => i(o),
          onAnimationEnd: () => {
            d(
              (g) => g.flatMap((y) => y.endpoint !== a || y.phase !== l ? [y] : l === "entering" ? [{ ...y, phase: "visible" }] : [])
            );
          },
          children: [
            /* @__PURE__ */ c("span", { children: a === "start" ? D.start : D.end }),
            k.date(o, m),
            /* @__PURE__ */ c("span", { "aria-hidden": "true", children: n === "before" ? "↑" : "↓" })
          ]
        },
        a
      )) })
    }
  );
}, xt = ({
  selection: t,
  config: e,
  onClear: n
}) => {
  const { labels: r, formatters: i, locale: u, classNames: s } = e, d = t ? t.start === t.end ? i.date(t.start, u) : `${i.date(t.start, u)} – ${i.date(
    t.end,
    u
  )}` : r.chooseDate;
  return /* @__PURE__ */ S(
    "header",
    {
      className: T(
        "quno-date-picker__selection-header",
        s == null ? void 0 : s.selectionHeader
      ),
      "data-slot": "selection-header",
      children: [
        /* @__PURE__ */ S("div", { children: [
          /* @__PURE__ */ c(
            "span",
            {
              className: T(
                "quno-date-picker__eyebrow",
                s == null ? void 0 : s.selectionEyebrow
              ),
              "data-slot": "selection-eyebrow",
              children: r.selectedPeriod
            }
          ),
          /* @__PURE__ */ c(
            "strong",
            {
              className: s == null ? void 0 : s.selectionSummary,
              "data-slot": "selection-summary",
              children: d
            }
          )
        ] }),
        /* @__PURE__ */ c(
          "button",
          {
            type: "button",
            className: T("quno-date-picker__clear", s == null ? void 0 : s.clearButton),
            "data-slot": "clear-button",
            disabled: !t,
            onClick: n,
            children: r.clear
          }
        )
      ]
    }
  );
}, U = () => ({ type: "idle" }), qt = (t, e, n) => ({
  type: "drag-endpoint",
  endpoint: e,
  origin: n,
  anchor: e === "start" ? t.end : t.start,
  current: t,
  moved: !1
}), Ut = (t, e) => {
  if (!t)
    return {
      type: "create",
      origin: e,
      current: { start: e, end: e },
      moved: !1
    };
  const n = e === t.start ? "start" : e === t.end ? "end" : null;
  return n ? qt(t, n, e) : B(e, t) ? {
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
}, nt = (t, e) => t.type === "idle" ? t : t.type === "create" ? {
  ...t,
  current: L(t.origin, e),
  moved: t.moved || e !== t.origin
} : t.type === "paint-pending" ? e === t.origin ? t : {
  type: "create",
  origin: t.origin,
  current: L(t.origin, e),
  moved: !0
} : t.type === "drag-range" ? {
  ...t,
  current: yt(t.original, t.origin, e),
  moved: t.moved || e !== t.origin
} : {
  ...t,
  endpoint: E(e, t.anchor) <= 0 ? "start" : "end",
  current: L(t.anchor, e),
  moved: t.moved || e !== t.origin
}, at = (t) => {
  for (let e = t.index + 1; e < t.actions.length; e += 1) {
    const n = ht(
      t.original,
      t.date,
      t.actions[e]
    );
    if (n.start !== t.value.start || n.end !== t.value.end)
      return { cycle: e === t.actions.length - 1 ? null : { ...t, index: e, value: n }, value: n, changed: !0 };
  }
  return { cycle: null, value: t.value, changed: !1 };
}, At = (t, e) => {
  if (t.type === "idle")
    return { interaction: t };
  if (t.type === "paint-pending" && e !== t.origin)
    return {
      interaction: U(),
      value: L(t.origin, e)
    };
  if (t.moved) {
    const d = nt(t, e);
    return d.type === "idle" ? { interaction: d } : { interaction: U(), value: d.current };
  }
  if (t.type === "create")
    return { interaction: U(), value: { start: e, end: e } };
  const n = t.type === "paint-pending" ? t.original : t.current, r = vt(n, e), i = r.defaultAction === "start" ? "end" : "start", u = [
    r.defaultAction,
    i,
    "single"
  ], s = at({
    date: e,
    original: n,
    actions: u,
    index: -1,
    value: n
  });
  return {
    interaction: U(),
    value: s.changed ? s.value : void 0,
    cycle: s.cycle ?? void 0
  };
}, $t = ({
  value: t,
  defaultValue: e,
  initialMonth: n,
  weekStartsOn: r,
  autoNavigateDelay: i,
  autoNavigateRepeatDelay: u,
  onChange: s,
  onVisibleMonthChange: d
}) => {
  const p = t !== void 0, [M, _] = I(e), D = p ? t ?? null : M, [k, m] = I(
    R(n ?? (D == null ? void 0 : D.start) ?? Y())
  ), [h, a] = I(null), [o, l] = I(U()), [g, y] = I(null), b = Q(null), w = () => {
    b.current !== null && (window.clearTimeout(b.current), b.current = null);
  };
  W(() => w, []);
  const x = (v) => {
    p || _(v), s == null || s(v);
  }, f = (v, C = null) => {
    a(C), m(v), d == null || d(v);
  }, q = (v) => {
    a(v), m((C) => {
      const $ = gt(C, v);
      return d == null || d($), $;
    }), y(null);
  }, rt = (o.type === "idle" ? null : o.current) ?? D, ot = (v) => {
    w(), l(Ut(D, v));
  }, it = (v) => {
    l((C) => nt(C, v));
  }, dt = (v) => {
    if (w(), (g == null ? void 0 : g.date) === v && o.type !== "idle" && !o.moved) {
      const F = at(g);
      y(F.cycle), l(U()), F.changed && x(F.value);
      return;
    }
    const $ = At(o, v);
    if (l($.interaction), y($.cycle ?? null), $.value && x($.value), !V(v, k)) {
      const F = E(v, k) < 0 ? -1 : 1;
      f(R(v), F);
    }
  }, st = (v) => {
    if (o.type === "idle") return;
    w();
    const C = () => {
      q(v), b.current = window.setTimeout(C, u);
    };
    b.current = window.setTimeout(C, i);
  }, lt = () => {
    w(), l(U()), y(null), x(null);
  }, ct = (v) => {
    w(), l(U()), y(null);
    const C = E(v, k) < 0 ? -1 : 1;
    f(R(v), C);
  };
  return {
    selection: D,
    renderedSelection: rt,
    visibleMonth: k,
    monthMotion: h,
    interaction: o,
    gridDates: ft(k, r),
    weekdays: Array.from({ length: 7 }, (v, C) => (r + C) % 7),
    beginDrag: ot,
    enterDay: it,
    finishDrag: dt,
    clear: lt,
    navigate: q,
    startEdgeNavigation: st,
    stopEdgeNavigation: w,
    jumpToEndpoint: ct
  };
}, Pt = ({
  value: t,
  defaultValue: e = null,
  initialMonth: n,
  locale: r = "en-GB",
  labels: i,
  formatters: u,
  weekStartsOn: s = 1,
  className: d,
  classNames: p,
  getDayCellProps: M,
  autoNavigateDelay: _ = 400,
  autoNavigateRepeatDelay: D = 650,
  onChange: k,
  onVisibleMonthChange: m
}) => {
  const h = {
    locale: r,
    labels: { ...Ct, ...i },
    formatters: { ...Et, ...u },
    classNames: p,
    getDayCellProps: M
  }, a = $t({
    value: t,
    defaultValue: e,
    initialMonth: n,
    weekStartsOn: s,
    autoNavigateDelay: _,
    autoNavigateRepeatDelay: D,
    onChange: k,
    onVisibleMonthChange: m
  }), o = a.selection ? [
    G(a.selection.start, a.visibleMonth),
    G(a.selection.end, a.visibleMonth)
  ] : [];
  return /* @__PURE__ */ S(
    "section",
    {
      className: T("quno-date-picker", d, p == null ? void 0 : p.root),
      "data-slot": "root",
      "data-pill-before": o.includes("before") || void 0,
      "data-pill-after": o.includes("after") || void 0,
      "aria-label": h.labels.calendar,
      onPointerUp: a.stopEdgeNavigation,
      children: [
        /* @__PURE__ */ c(
          xt,
          {
            selection: a.selection,
            config: h,
            onClear: a.clear
          }
        ),
        /* @__PURE__ */ c(
          K,
          {
            selection: a.selection,
            visibleMonth: a.visibleMonth,
            position: "before",
            config: h,
            onJump: a.jumpToEndpoint
          }
        ),
        /* @__PURE__ */ c(_t, { controller: a, config: h }),
        /* @__PURE__ */ c(
          K,
          {
            selection: a.selection,
            visibleMonth: a.visibleMonth,
            position: "after",
            config: h,
            onJump: a.jumpToEndpoint
          }
        ),
        h.labels.hint && /* @__PURE__ */ c(
          "p",
          {
            className: T("quno-date-picker__hint", p == null ? void 0 : p.hint),
            "data-slot": "hint",
            children: h.labels.hint
          }
        )
      ]
    }
  );
};
export {
  Pt as QunoDatePicker,
  P as addDays,
  gt as addMonths,
  ht as applyDateAction,
  ft as calendarGrid,
  E as compareDates,
  vt as dateActionContext,
  Z as differenceInDays,
  et as editEndpoint,
  V as isInMonth,
  B as isWithinRange,
  G as monthRelation,
  yt as moveRange,
  tt as nearestEndpoint,
  L as normalizeRange,
  St as selectDate,
  R as startOfMonth
};
