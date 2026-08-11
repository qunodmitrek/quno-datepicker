import { jsx as f, jsxs as B } from "preact/jsx-runtime";
import { useRef as K, useState as R, useEffect as Q, useMemo as kt } from "preact/hooks";
function ut(t) {
  var e, n, a = "";
  if (typeof t == "string" || typeof t == "number") a += t;
  else if (typeof t == "object") if (Array.isArray(t)) {
    var d = t.length;
    for (e = 0; e < d; e++) t[e] && (n = ut(t[e])) && (a && (a += " "), a += n);
  } else for (n in t) t[n] && (a && (a += " "), a += n);
  return a;
}
function M() {
  for (var t, e, n = 0, a = "", d = arguments.length; n < d; n++) (t = arguments[n]) && (e = ut(t)) && (a && (a += " "), a += e);
  return a;
}
const _t = 864e5, X = (t) => t.toString().padStart(2, "0"), z = (t) => `${t.getUTCFullYear()}-${X(t.getUTCMonth() + 1)}-${X(
  t.getUTCDate()
)}`, L = (t) => {
  const [e, n, a] = t.split("-").map(Number);
  return new Date(Date.UTC(e, n - 1, a));
}, rt = () => {
  const t = /* @__PURE__ */ new Date();
  return `${t.getFullYear()}-${X(t.getMonth() + 1)}-${X(
    t.getDate()
  )}`;
}, q = (t, e) => t.localeCompare(e), Z = (t, e) => {
  const n = L(t);
  return n.setUTCDate(n.getUTCDate() + e), z(n);
}, N = (t, e) => Math.round((L(t).getTime() - L(e).getTime()) / _t), j = (t) => `${t.slice(0, 7)}-01`, lt = (t) => {
  const e = L(j(t));
  return e.setUTCMonth(e.getUTCMonth() + 1), e.setUTCDate(0), z(e);
}, bt = (t, e) => {
  const n = L(j(t));
  return n.setUTCMonth(n.getUTCMonth() + e), z(n);
}, pt = (t, e) => t.slice(0, 7) === e.slice(0, 7), J = (t, e) => q(t, e) <= 0 ? { start: t, end: e } : { start: e, end: t }, gt = (t, e) => {
  if (t.start === t.end)
    return q(e, t.start) < 0 ? "start" : "end";
  const n = Math.abs(N(e, t.start)), a = Math.abs(N(e, t.end));
  return n < a ? "start" : "end";
}, ht = (t, e, n) => {
  const a = e === "start" ? t.end : t.start, d = e === "start" ? q(n, a) > 0 : q(n, a) < 0;
  return {
    range: J(n, a),
    endpoint: d ? e === "start" ? "end" : "start" : e
  };
}, Tt = (t, e, n) => n === "single" ? { start: e, end: e } : ht(t, n, e).range, wt = (t, e) => {
  const n = q(e, t.start) < 0 ? "start" : q(e, t.end) > 0 ? "end" : gt(t, e);
  return {
    defaultAction: n,
    alternatives: [n === "start" ? "end" : "start", "single"]
  };
}, Jt = (t, e) => t ? ht(t, gt(t, e), e).range : { start: e, end: e }, Ct = (t, e, n) => {
  const a = N(n, e);
  return {
    start: Z(t.start, a),
    end: Z(t.end, a)
  };
}, Mt = (t, e = 1) => {
  const n = L(j(t)), a = (n.getUTCDay() - e + 7) % 7, d = Z(z(n), -a), c = L(lt(t)), i = ((e + 6) % 7 - c.getUTCDay() + 7) % 7, o = z(c), g = Z(o, i), _ = (N(g, d) + 1) / 7, C = Math.max(6, _ + (g === o ? 1 : 0)) * 7;
  return Array.from(
    { length: C },
    (E, k) => Z(d, k)
  );
}, F = (t, e) => q(t, e.start) >= 0 && q(t, e.end) <= 0, nt = (t, e) => q(t, j(e)) < 0 ? "before" : q(t, lt(e)) > 0 ? "after" : "visible", ot = (t) => {
  const e = t == null ? void 0 : t.closest(
    "[data-touch-date], [data-date]"
  ), n = (e == null ? void 0 : e.dataset.touchDate) ?? (e == null ? void 0 : e.dataset.date);
  return n ? {
    date: n,
    overflowIndex: (e == null ? void 0 : e.dataset.touchIndex) === void 0 ? null : Number(e.dataset.touchIndex)
  } : null;
}, it = (t) => {
  var n;
  const e = (n = document.elementFromPoint) == null ? void 0 : n.call(document, t.clientX, t.clientY);
  return ot(e) ?? ot(t.target);
}, et = (t) => t.pointerId ?? 0, Et = (t, e) => {
  var n;
  try {
    (n = t.setPointerCapture) == null || n.call(t, e);
  } catch {
  }
}, xt = (t, e) => {
  var n;
  try {
    (n = t.hasPointerCapture) != null && n.call(t, e) && t.releasePointerCapture(e);
  } catch {
  }
}, qt = ({
  interactionActive: t,
  begin: e,
  enter: n,
  finish: a,
  cancel: d
}) => {
  const c = K(null), r = (o) => {
    var g;
    return ((g = c.current) == null ? void 0 : g.id) === et(o) || c.current === null && t;
  }, i = (o) => {
    const g = et(o);
    xt(o.currentTarget, g), c.current = null;
  };
  return {
    beginPointer: (o, g) => {
      o.preventDefault();
      const _ = et(o);
      c.current = { id: _, start: g }, Et(o.currentTarget, _), e(g);
    },
    movePointer: (o) => {
      if (!r(o)) return;
      o.preventDefault();
      const g = it(o);
      g && n(g);
    },
    finishPointer: (o, g) => {
      var D;
      if (!r(o)) return;
      o.preventDefault();
      const _ = it(o) ?? {
        date: ((D = c.current) == null ? void 0 : D.start) ?? g,
        overflowIndex: null
      };
      i(o), a(_);
    },
    cancelPointer: (o) => {
      r(o) && (i(o), d());
    }
  };
}, Ut = ({
  dates: t,
  visibleMonth: e,
  monthMotion: n,
  movingSelection: a,
  interactionActive: d,
  cycleDate: c,
  cyclePreview: r,
  selection: i,
  renderedSelection: o,
  config: g,
  onBegin: _,
  onEnter: D,
  onFinish: C,
  onCancel: E,
  onOverflowChange: k
}) => {
  const { labels: v, formatters: p, locale: u, classNames: s, getDayCellProps: y } = g, T = rt(), h = qt({
    interactionActive: d,
    begin: _,
    enter: ({ date: l, overflowIndex: b }) => {
      k(b), D(l);
    },
    finish: ({ date: l }) => {
      k(null), C(l);
    },
    cancel: () => {
      k(null), E();
    }
  });
  return /* @__PURE__ */ f(
    "div",
    {
      className: M("quno-date-picker__grid", s == null ? void 0 : s.grid),
      "data-slot": "grid",
      "data-dragging": a ? "move" : void 0,
      "data-month-motion": n === -1 ? "previous" : n === 1 ? "next" : void 0,
      role: "grid",
      "aria-label": `${v.calendar}: ${p.month(
        e,
        u
      )}`,
      children: t.map((l, b) => {
        const w = pt(l, e), A = i ? F(l, i) : !1, I = o ? F(l, o) : !1, W = (o == null ? void 0 : o.start) === l, H = (o == null ? void 0 : o.end) === l, O = r ? F(l, r) : !1, V = O && (b % 7 === 0 || !r || !F(t[b - 1], r)), tt = O && (b % 7 === 6 || !r || !F(t[b + 1], r)), Y = L(
          l
        ).getUTCDay(), U = y == null ? void 0 : y({
          date: l,
          weekday: Y,
          isToday: l === T,
          isWeekend: Y === 0 || Y === 6,
          isOutside: !w,
          isSelected: I,
          isCommitted: A,
          isRangeStart: W,
          isRangeEnd: H
        });
        return /* @__PURE__ */ B(
          "button",
          {
            type: "button",
            role: "gridcell",
            className: M(
              "quno-date-picker__day",
              {
                "quno-date-picker__day--outside": !w,
                "quno-date-picker__day--selected": I,
                "quno-date-picker__day--committed": A,
                "quno-date-picker__day--start": W,
                "quno-date-picker__day--end": H
              },
              s == null ? void 0 : s.day,
              U == null ? void 0 : U.className
            ),
            style: U == null ? void 0 : U.style,
            title: U == null ? void 0 : U.title,
            "data-slot": "day",
            "data-date": l,
            "data-cycle-trigger": c === l ? "true" : void 0,
            "data-cycle-preview": O ? "true" : void 0,
            "data-cycle-preview-start": V ? "true" : void 0,
            "data-cycle-preview-end": tt ? "true" : void 0,
            "data-cycle-preview-range-start": (r == null ? void 0 : r.start) === l ? "true" : void 0,
            "data-cycle-preview-range-end": (r == null ? void 0 : r.end) === l ? "true" : void 0,
            "data-range-start": W ? "true" : void 0,
            "data-range-end": H ? "true" : void 0,
            "data-outside": w ? void 0 : "true",
            "data-selected": I ? "true" : void 0,
            "data-committed": A ? "true" : void 0,
            "aria-label": p.dayLabel(l, u),
            "aria-selected": A,
            onPointerDown: (G) => {
              k(null), h.beginPointer(G, l);
            },
            onPointerMove: h.movePointer,
            onPointerEnter: () => {
              k(null), D(l);
            },
            onPointerUp: (G) => h.finishPointer(G, l),
            onPointerCancel: h.cancelPointer,
            children: [
              /* @__PURE__ */ f("span", { children: Number(l.slice(-2)) }),
              (W || H) && /* @__PURE__ */ f(
                "i",
                {
                  className: M(
                    "quno-date-picker__handle",
                    s == null ? void 0 : s.handle
                  ),
                  "data-slot": "handle",
                  "aria-hidden": "true"
                }
              )
            ]
          },
          l
        );
      })
    }
  );
}, st = ({ direction: t }) => /* @__PURE__ */ f("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", focusable: "false", children: /* @__PURE__ */ f(
  "path",
  {
    d: t === -1 ? "M10 3.5 5.5 8 10 12.5" : "M6 3.5 10.5 8 6 12.5",
    fill: "none",
    stroke: "currentColor",
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    "stroke-width": "1.6"
  }
) }), At = ({
  visibleMonth: t,
  monthMotion: e,
  config: n,
  onNavigate: a
}) => {
  const { labels: d, formatters: c, locale: r, classNames: i } = n;
  return /* @__PURE__ */ B(
    "div",
    {
      className: M(
        "quno-date-picker__month-header",
        i == null ? void 0 : i.monthHeader
      ),
      "data-slot": "month-header",
      children: [
        /* @__PURE__ */ f(
          "button",
          {
            type: "button",
            className: i == null ? void 0 : i.previousButton,
            "data-slot": "previous-button",
            "aria-label": d.previousMonth,
            onClick: () => a(-1),
            children: /* @__PURE__ */ f(st, { direction: -1 })
          }
        ),
        /* @__PURE__ */ f(
          "h2",
          {
            className: i == null ? void 0 : i.monthHeading,
            "data-slot": "month-heading",
            "data-month-motion": e === -1 ? "previous" : e === 1 ? "next" : void 0,
            children: /* @__PURE__ */ f("span", { children: c.month(t, r) }, t)
          }
        ),
        /* @__PURE__ */ f(
          "button",
          {
            type: "button",
            className: i == null ? void 0 : i.nextButton,
            "data-slot": "next-button",
            "aria-label": d.nextMonth,
            onClick: () => a(1),
            children: /* @__PURE__ */ f(st, { direction: 1 })
          }
        )
      ]
    }
  );
}, dt = (t, e) => {
  const n = t == null ? void 0 : t.closest(
    "[data-day-index]"
  );
  return e.indexOf(Number(n == null ? void 0 : n.dataset.dayIndex));
}, It = ({
  controller: t,
  config: e,
  touchOverflowIndex: n
}) => {
  const [a, d] = R({ type: "weekdays" }), { classNames: c, formatters: r, locale: i } = e, { interaction: o, renderedSelection: g, weekdays: _ } = t, D = o.type !== "idle", C = rt(), E = Array.from(
    { length: 7 },
    (p, u) => Z(t.gridDates[0], u - 7)
  );
  Q(() => {
    if (!D || n === null) {
      d({ type: "weekdays" });
      return;
    }
    d({ type: "previous-dates", pointerIndex: n });
  }, [D, n]);
  const k = (p) => {
    !D || p < 0 || (d({ type: "previous-dates", pointerIndex: p }), t.enterDay(E[p]));
  }, v = (p) => {
    d({ type: "weekdays" }), t.finishDrag(p);
  };
  return /* @__PURE__ */ f(
    "div",
    {
      className: M("quno-date-picker__weekdays", c == null ? void 0 : c.weekdays),
      "data-slot": "weekdays",
      "data-drag-overflow": a.type === "previous-dates" ? "previous" : void 0,
      "data-drag-active": D ? "true" : void 0,
      "aria-hidden": "true",
      onPointerEnter: (p) => k(dt(p.target, _)),
      onPointerLeave: () => d({ type: "weekdays" }),
      onPointerUp: (p) => {
        if (!D) return;
        const u = dt(p.target, _);
        u < 0 || (p.preventDefault(), v(E[u]));
      },
      children: _.map((p, u) => {
        var A;
        const s = E[u], y = g ? F(s, g) : !1;
        if (!(a.type === "previous-dates" && (y || u === a.pointerIndex)))
          return /* @__PURE__ */ f(
            "span",
            {
              className: c == null ? void 0 : c.weekday,
              "data-slot": "weekday",
              "data-day-index": p,
              "data-touch-date": s,
              "data-touch-index": u,
              onPointerEnter: () => k(u),
              children: r.weekday(p, i)
            },
            p
          );
        const h = (g == null ? void 0 : g.start) === s, l = (g == null ? void 0 : g.end) === s, b = t.selection ? F(s, t.selection) : !1, w = (A = e.getDayCellProps) == null ? void 0 : A.call(e, {
          date: s,
          weekday: p,
          isToday: s === C,
          isWeekend: p === 0 || p === 6,
          isOutside: !0,
          isSelected: y,
          isCommitted: b,
          isRangeStart: h,
          isRangeEnd: l
        });
        return /* @__PURE__ */ f(
          "span",
          {
            className: M(
              "quno-date-picker__day",
              "quno-date-picker__day--outside",
              "quno-date-picker__overflow-day",
              y && "quno-date-picker__day--selected",
              h && "quno-date-picker__day--start",
              l && "quno-date-picker__day--end",
              c == null ? void 0 : c.day,
              c == null ? void 0 : c.overflowDay,
              w == null ? void 0 : w.className
            ),
            style: w == null ? void 0 : w.style,
            title: w == null ? void 0 : w.title,
            "data-slot": "overflow-day",
            "data-day-index": p,
            "data-date": s,
            "data-touch-date": s,
            "data-touch-index": u,
            "data-selected": y ? "true" : void 0,
            "data-range-start": h ? "true" : void 0,
            "data-range-end": l ? "true" : void 0,
            "data-outside": "true",
            onPointerEnter: () => k(u),
            onPointerUp: (I) => {
              I.preventDefault(), I.stopPropagation(), v(s);
            },
            children: /* @__PURE__ */ f("span", { children: Number(s.slice(-2)) })
          },
          p
        );
      })
    }
  );
}, Rt = ({ controller: t, config: e }) => {
  const [n, a] = R(
    null
  ), { classNames: d } = e, c = t.interaction.type === "drag-range" || t.interaction.type === "drag-endpoint";
  return /* @__PURE__ */ B(
    "div",
    {
      className: M("quno-date-picker__calendar-shell", d == null ? void 0 : d.calendar),
      "data-slot": "calendar",
      "data-dragging": c ? "move" : void 0,
      children: [
        ["previous", "next"].map((r) => /* @__PURE__ */ f(
          "div",
          {
            className: M(
              "quno-date-picker__edge",
              `quno-date-picker__edge--${r}`,
              d == null ? void 0 : d.edge
            ),
            "data-slot": "edge",
            "data-direction": r,
            "aria-hidden": "true",
            onPointerEnter: () => t.startEdgeNavigation(r === "previous" ? -1 : 1),
            onPointerLeave: t.stopEdgeNavigation
          },
          r
        )),
        /* @__PURE__ */ f(
          At,
          {
            visibleMonth: t.visibleMonth,
            monthMotion: t.monthMotion,
            config: e,
            onNavigate: t.navigate
          }
        ),
        /* @__PURE__ */ f(
          It,
          {
            controller: t,
            config: e,
            touchOverflowIndex: n
          }
        ),
        /* @__PURE__ */ f(
          Ut,
          {
            dates: t.gridDates,
            visibleMonth: t.visibleMonth,
            monthMotion: t.monthMotion,
            movingSelection: c,
            interactionActive: t.interaction.type !== "idle",
            cycleDate: t.cycleDate,
            cyclePreview: t.cyclePreview,
            selection: t.selection,
            renderedSelection: t.renderedSelection,
            config: e,
            onBegin: t.beginDrag,
            onEnter: t.enterDay,
            onFinish: t.finishDrag,
            onCancel: t.cancelDrag,
            onOverflowChange: a
          },
          t.visibleMonth
        )
      ]
    }
  );
}, St = (t, e) => new Intl.DateTimeFormat(e, {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC"
}).format(/* @__PURE__ */ new Date(`${t}T00:00:00Z`)), $t = (t, e) => new Intl.DateTimeFormat(e, {
  month: "long",
  year: "numeric",
  timeZone: "UTC"
}).format(/* @__PURE__ */ new Date(`${t}T00:00:00Z`)), Pt = (t, e) => new Intl.DateTimeFormat(e, {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC"
}).format(/* @__PURE__ */ new Date(`${t}T00:00:00Z`)), Ft = (t, e) => new Intl.DateTimeFormat(e, {
  weekday: "short",
  timeZone: "UTC"
}).format(new Date(Date.UTC(2026, 7, 2 + t))), Lt = {
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
}, jt = {
  date: St,
  month: $t,
  dayLabel: Pt,
  weekday: Ft
}, ct = ({
  selection: t,
  visibleMonth: e,
  position: n,
  monthChangeSource: a,
  config: d,
  onJump: c
}) => {
  const r = kt(
    () => t ? [
      { endpoint: "start", date: t.start },
      { endpoint: "end", date: t.end }
    ].filter(
      ({ date: u }) => nt(u, e) === n
    ) : [],
    [n, t, e]
  ), [i, o] = R(
    () => r.map((u) => ({
      ...u,
      phase: "entering",
      calendarReveal: "moving"
    }))
  ), g = K(null), _ = K(e);
  Q(() => {
    const u = _.current !== e && a === "navigation" ? "stationary" : "moving";
    _.current = e, o((s) => {
      const y = s.map((h) => {
        const l = r.find(
          ({ endpoint: b }) => b === h.endpoint
        );
        return l ? {
          ...l,
          phase: h.phase === "exiting" ? "entering" : h.phase,
          calendarReveal: h.phase === "exiting" ? u : h.calendarReveal
        } : { ...h, phase: "exiting" };
      }), T = r.filter(
        ({ endpoint: h }) => !s.some((l) => l.endpoint === h)
      ).map((h) => ({
        ...h,
        phase: "entering",
        calendarReveal: u
      }));
      return [...y, ...T];
    });
  }, [r, a, e]);
  const D = i.map(({ endpoint: u, phase: s }) => `${u}:${s}`).join("|");
  if (Q(() => {
    var y;
    const u = (y = g.current) == null ? void 0 : y.querySelector(
      '[data-item-presence="entering"], [data-item-presence="exiting"]'
    );
    if (!u) return;
    const s = window.getComputedStyle(u).animationName;
    (!s || s === "none") && o(
      (T) => T.flatMap(
        (h) => h.phase === "exiting" ? [] : [{ ...h, phase: "visible" }]
      )
    );
  }, [D]), !i.length) return null;
  const C = i.every(({ phase: u }) => u === "exiting") ? "exiting" : i.some(({ phase: u }) => u === "visible") ? "visible" : "entering", { labels: E, formatters: k, locale: v, classNames: p } = d;
  return /* @__PURE__ */ f(
    "div",
    {
      ref: g,
      className: M(
        "quno-date-picker__pills",
        `quno-date-picker__pills--${n}`,
        p == null ? void 0 : p.pills
      ),
      "data-slot": "pills",
      "data-position": n,
      "data-presence": C,
      "data-calendar-reveal": i.some(
        ({ phase: u, calendarReveal: s }) => u === "entering" && s === "stationary"
      ) ? "stationary" : void 0,
      "aria-hidden": C === "exiting" || void 0,
      children: /* @__PURE__ */ f("div", { className: "quno-date-picker__pills-track", children: i.map(({ endpoint: u, date: s, phase: y }) => /* @__PURE__ */ B(
        "button",
        {
          type: "button",
          className: M("quno-date-picker__pill", p == null ? void 0 : p.pill),
          "data-slot": "pill",
          "data-endpoint": u,
          "data-position": n,
          "data-item-presence": y,
          "aria-hidden": y === "exiting" || void 0,
          disabled: y === "exiting",
          onClick: () => c(s),
          onAnimationEnd: () => {
            o(
              (T) => T.flatMap((h) => h.endpoint !== u || h.phase !== y ? [h] : y === "entering" ? [{ ...h, phase: "visible" }] : [])
            );
          },
          children: [
            /* @__PURE__ */ f("span", { children: u === "start" ? E.start : E.end }),
            k.date(s, v),
            /* @__PURE__ */ f("span", { "aria-hidden": "true", children: n === "before" ? "↑" : "↓" })
          ]
        },
        u
      )) })
    }
  );
}, Bt = ({
  selection: t,
  config: e,
  onClear: n
}) => {
  const { labels: a, formatters: d, locale: c, classNames: r } = e, i = t ? t.start === t.end ? d.date(t.start, c) : `${d.date(t.start, c)} – ${d.date(
    t.end,
    c
  )}` : a.chooseDate;
  return /* @__PURE__ */ B(
    "header",
    {
      className: M(
        "quno-date-picker__selection-header",
        r == null ? void 0 : r.selectionHeader
      ),
      "data-slot": "selection-header",
      children: [
        /* @__PURE__ */ B("div", { children: [
          /* @__PURE__ */ f(
            "span",
            {
              className: M(
                "quno-date-picker__eyebrow",
                r == null ? void 0 : r.selectionEyebrow
              ),
              "data-slot": "selection-eyebrow",
              children: a.selectedPeriod
            }
          ),
          /* @__PURE__ */ f(
            "strong",
            {
              className: r == null ? void 0 : r.selectionSummary,
              "data-slot": "selection-summary",
              children: i
            }
          )
        ] }),
        /* @__PURE__ */ f(
          "button",
          {
            type: "button",
            className: M("quno-date-picker__clear", r == null ? void 0 : r.clearButton),
            "data-slot": "clear-button",
            disabled: !t,
            onClick: n,
            children: a.clear
          }
        )
      ]
    }
  );
}, S = () => ({ type: "idle" }), Wt = (t, e, n) => ({
  type: "drag-endpoint",
  endpoint: e,
  origin: n,
  anchor: e === "start" ? t.end : t.start,
  current: t,
  moved: !1
}), Zt = (t, e) => {
  if (!t)
    return {
      type: "create",
      origin: e,
      current: { start: e, end: e },
      moved: !1
    };
  const n = e === t.start ? "start" : e === t.end ? "end" : null;
  return n ? Wt(t, n, e) : F(e, t) ? {
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
}, ft = (t, e) => t.type === "idle" ? t : t.type === "create" ? {
  ...t,
  current: J(t.origin, e),
  moved: t.moved || e !== t.origin
} : t.type === "paint-pending" ? e === t.origin ? t : {
  type: "create",
  origin: t.origin,
  current: J(t.origin, e),
  moved: !0
} : t.type === "drag-range" ? {
  ...t,
  current: Ct(t.original, t.origin, e),
  moved: t.moved || e !== t.origin
} : {
  ...t,
  endpoint: q(e, t.anchor) <= 0 ? "start" : "end",
  current: J(t.anchor, e),
  moved: t.moved || e !== t.origin
}, at = (t) => {
  for (let e = t.index + 1; e < t.actions.length; e += 1) {
    const n = Tt(
      t.original,
      t.date,
      t.actions[e]
    );
    if (n.start !== t.value.start || n.end !== t.value.end)
      return { cycle: e === t.actions.length - 1 ? null : { ...t, index: e, value: n }, value: n, changed: !0 };
  }
  return { cycle: null, value: t.value, changed: !1 };
}, Ht = (t, e) => {
  if (t.type === "idle")
    return { interaction: t };
  if (t.type === "paint-pending" && e !== t.origin)
    return {
      interaction: S(),
      value: J(t.origin, e)
    };
  if (t.moved) {
    const i = ft(t, e);
    return i.type === "idle" ? { interaction: i } : { interaction: S(), value: i.current };
  }
  if (t.type === "create")
    return { interaction: S(), value: { start: e, end: e } };
  const n = t.type === "paint-pending" ? t.original : t.current, a = wt(n, e), d = a.defaultAction === "start" ? "end" : "start", c = [
    a.defaultAction,
    d,
    "single"
  ], r = at({
    date: e,
    original: n,
    actions: c,
    index: -1,
    value: n
  });
  return {
    interaction: S(),
    value: r.changed ? r.value : void 0,
    cycle: r.cycle ?? void 0
  };
}, Ot = ({
  value: t,
  defaultValue: e,
  initialMonth: n,
  weekStartsOn: a,
  autoNavigateDelay: d,
  autoNavigateRepeatDelay: c,
  onChange: r,
  onVisibleMonthChange: i
}) => {
  const o = t !== void 0, [g, _] = R(e), D = o ? t ?? null : g, [C, E] = R(
    j(n ?? (D == null ? void 0 : D.start) ?? rt())
  ), [k, v] = R(null), [p, u] = R(null), [s, y] = R(S()), [T, h] = R(null), l = K(null), b = () => {
    l.current !== null && (window.clearTimeout(l.current), l.current = null);
  };
  Q(() => b, []);
  const w = (m) => {
    o || _(m), r == null || r(m);
  }, A = (m, x = null, $ = "interaction") => {
    v(x), u($), E(m), i == null || i(m);
  }, I = (m, x) => {
    v(m), u(x), E(($) => {
      const P = bt($, m);
      return i == null || i(P), P;
    }), h(null);
  }, W = (m) => I(m, "navigation"), O = (s.type === "idle" ? null : s.current) ?? D, V = (T == null ? void 0 : T.date) ?? null, tt = T ? at(T).value : null, Y = (m) => {
    b(), y(Zt(D, m));
  }, U = (m) => {
    y((x) => ft(x, m));
  }, G = (m) => {
    if (b(), (T == null ? void 0 : T.date) === m && s.type !== "idle" && !s.moved) {
      const P = at(T);
      h(P.cycle), y(S()), P.changed && w(P.value);
      return;
    }
    const $ = Ht(s, m);
    if (y($.interaction), h($.cycle ?? null), $.value && w($.value), !pt(m, C)) {
      const P = q(m, C) < 0 ? -1 : 1;
      A(j(m), P, "interaction");
    }
  }, vt = () => {
    b(), y(S());
  }, yt = (m) => {
    if (s.type === "idle") return;
    b();
    const x = () => {
      I(m, "interaction"), l.current = window.setTimeout(x, c);
    };
    l.current = window.setTimeout(x, d);
  }, mt = () => {
    b(), y(S()), h(null), w(null);
  }, Dt = (m) => {
    b(), y(S()), h(null);
    const x = q(m, C) < 0 ? -1 : 1;
    A(j(m), x, "endpoint");
  };
  return {
    selection: D,
    renderedSelection: O,
    cycleDate: V,
    cyclePreview: tt,
    visibleMonth: C,
    monthMotion: k,
    monthChangeSource: p,
    interaction: s,
    gridDates: Mt(C, a),
    weekdays: Array.from({ length: 7 }, (m, x) => (a + x) % 7),
    beginDrag: Y,
    enterDay: U,
    finishDrag: G,
    cancelDrag: vt,
    clear: mt,
    navigate: W,
    startEdgeNavigation: yt,
    stopEdgeNavigation: b,
    jumpToEndpoint: Dt
  };
}, zt = ({
  value: t,
  defaultValue: e = null,
  initialMonth: n,
  locale: a = "en-GB",
  labels: d,
  formatters: c,
  weekStartsOn: r = 1,
  className: i,
  classNames: o,
  getDayCellProps: g,
  autoNavigateDelay: _ = 400,
  autoNavigateRepeatDelay: D = 650,
  onChange: C,
  onVisibleMonthChange: E
}) => {
  const k = {
    locale: a,
    labels: { ...Lt, ...d },
    formatters: { ...jt, ...c },
    classNames: o,
    getDayCellProps: g
  }, v = Ot({
    value: t,
    defaultValue: e,
    initialMonth: n,
    weekStartsOn: r,
    autoNavigateDelay: _,
    autoNavigateRepeatDelay: D,
    onChange: C,
    onVisibleMonthChange: E
  }), p = v.selection ? [
    nt(v.selection.start, v.visibleMonth),
    nt(v.selection.end, v.visibleMonth)
  ] : [];
  return /* @__PURE__ */ B(
    "section",
    {
      className: M("quno-date-picker", i, o == null ? void 0 : o.root),
      "data-slot": "root",
      "data-pill-before": p.includes("before") || void 0,
      "data-pill-after": p.includes("after") || void 0,
      "aria-label": k.labels.calendar,
      onPointerUp: v.stopEdgeNavigation,
      children: [
        /* @__PURE__ */ f(
          Bt,
          {
            selection: v.selection,
            config: k,
            onClear: v.clear
          }
        ),
        /* @__PURE__ */ f(
          ct,
          {
            selection: v.selection,
            visibleMonth: v.visibleMonth,
            position: "before",
            monthChangeSource: v.monthChangeSource,
            config: k,
            onJump: v.jumpToEndpoint
          }
        ),
        /* @__PURE__ */ f(Rt, { controller: v, config: k }),
        /* @__PURE__ */ f(
          ct,
          {
            selection: v.selection,
            visibleMonth: v.visibleMonth,
            position: "after",
            monthChangeSource: v.monthChangeSource,
            config: k,
            onJump: v.jumpToEndpoint
          }
        ),
        k.labels.hint && /* @__PURE__ */ f(
          "p",
          {
            className: M("quno-date-picker__hint", o == null ? void 0 : o.hint),
            "data-slot": "hint",
            children: k.labels.hint
          }
        )
      ]
    }
  );
};
export {
  zt as QunoDatePicker,
  Z as addDays,
  bt as addMonths,
  Tt as applyDateAction,
  Mt as calendarGrid,
  q as compareDates,
  wt as dateActionContext,
  N as differenceInDays,
  ht as editEndpoint,
  pt as isInMonth,
  F as isWithinRange,
  nt as monthRelation,
  Ct as moveRange,
  gt as nearestEndpoint,
  J as normalizeRange,
  Jt as selectDate,
  j as startOfMonth
};
