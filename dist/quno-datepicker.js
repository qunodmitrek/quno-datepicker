import { jsx as f, jsxs as W } from "preact/jsx-runtime";
import { useRef as Q, useState as R, useEffect as X, useMemo as kt } from "preact/hooks";
function ut(t) {
  var e, n, a = "";
  if (typeof t == "string" || typeof t == "number") a += t;
  else if (typeof t == "object") if (Array.isArray(t)) {
    var c = t.length;
    for (e = 0; e < c; e++) t[e] && (n = ut(t[e])) && (a && (a += " "), a += n);
  } else for (n in t) t[n] && (a && (a += " "), a += n);
  return a;
}
function x() {
  for (var t, e, n = 0, a = "", c = arguments.length; n < c; n++) (t = arguments[n]) && (e = ut(t)) && (a && (a += " "), a += e);
  return a;
}
const _t = 864e5, N = (t) => t.toString().padStart(2, "0"), z = (t) => `${t.getUTCFullYear()}-${N(t.getUTCMonth() + 1)}-${N(
  t.getUTCDate()
)}`, L = (t) => {
  const [e, n, a] = t.split("-").map(Number);
  return new Date(Date.UTC(e, n - 1, a));
}, rt = () => {
  const t = /* @__PURE__ */ new Date();
  return `${t.getFullYear()}-${N(t.getMonth() + 1)}-${N(
    t.getDate()
  )}`;
}, I = (t, e) => t.localeCompare(e), H = (t, e) => {
  const n = L(t);
  return n.setUTCDate(n.getUTCDate() + e), z(n);
}, V = (t, e) => Math.round((L(t).getTime() - L(e).getTime()) / _t), B = (t) => `${t.slice(0, 7)}-01`, lt = (t) => {
  const e = L(B(t));
  return e.setUTCMonth(e.getUTCMonth() + 1), e.setUTCDate(0), z(e);
}, bt = (t, e) => {
  const n = L(B(t));
  return n.setUTCMonth(n.getUTCMonth() + e), z(n);
}, pt = (t, e) => t.slice(0, 7) === e.slice(0, 7), J = (t, e) => I(t, e) <= 0 ? { start: t, end: e } : { start: e, end: t }, gt = (t, e) => {
  if (t.start === t.end)
    return I(e, t.start) < 0 ? "start" : "end";
  const n = Math.abs(V(e, t.start)), a = Math.abs(V(e, t.end));
  return n < a ? "start" : "end";
}, ht = (t, e, n) => {
  const a = e === "start" ? t.end : t.start, c = e === "start" ? I(n, a) > 0 : I(n, a) < 0;
  return {
    range: J(n, a),
    endpoint: c ? e === "start" ? "end" : "start" : e
  };
}, Tt = (t, e, n) => n === "single" ? { start: e, end: e } : ht(t, n, e).range, wt = (t, e) => {
  const n = I(e, t.start) < 0 ? "start" : I(e, t.end) > 0 ? "end" : gt(t, e);
  return {
    defaultAction: n,
    alternatives: [n === "start" ? "end" : "start", "single"]
  };
}, zt = (t, e) => t ? ht(t, gt(t, e), e).range : { start: e, end: e }, Ct = (t, e, n) => {
  const a = V(n, e);
  return {
    start: H(t.start, a),
    end: H(t.end, a)
  };
}, xt = (t, e = 1) => {
  const n = L(B(t)), a = (n.getUTCDay() - e + 7) % 7, c = H(z(n), -a), i = L(lt(t)), s = ((e + 6) % 7 - i.getUTCDay() + 7) % 7, o = z(i), p = H(o, s), _ = (V(p, c) + 1) / 7, C = Math.max(6, _ + (p === o ? 1 : 0)) * 7;
  return Array.from(
    { length: C },
    (M, k) => H(c, k)
  );
}, F = (t, e) => I(t, e.start) >= 0 && I(t, e.end) <= 0, nt = (t, e) => I(t, B(e)) < 0 ? "before" : I(t, lt(e)) > 0 ? "after" : "visible", ot = (t) => {
  const e = t == null ? void 0 : t.closest(
    "[data-touch-date], [data-date]"
  ), n = (e == null ? void 0 : e.dataset.touchDate) ?? (e == null ? void 0 : e.dataset.date);
  return n ? {
    date: n,
    overflowIndex: (e == null ? void 0 : e.dataset.touchIndex) === void 0 ? null : Number(e.dataset.touchIndex)
  } : null;
}, it = (t) => typeof document.elementFromPoint == "function" ? ot(document.elementFromPoint(t.clientX, t.clientY)) : ot(t.target), Mt = (t, e) => t.date === e.date && t.overflowIndex === e.overflowIndex, K = (t) => t.pointerId ?? 0, Et = (t, e) => {
  var n;
  try {
    (n = t.setPointerCapture) == null || n.call(t, e);
  } catch {
  }
}, qt = (t, e) => {
  var n;
  try {
    (n = t.hasPointerCapture) != null && n.call(t, e) && t.releasePointerCapture(e);
  } catch {
  }
}, It = ({
  interactionActive: t,
  begin: e,
  enter: n,
  finish: a,
  cancel: c
}) => {
  const i = Q(null), r = (o) => {
    var p;
    return ((p = i.current) == null ? void 0 : p.id) === K(o) || i.current === null && t;
  }, s = (o) => {
    const p = K(o);
    qt(o.currentTarget, p), i.current = null;
  };
  return {
    beginPointer: (o, p) => {
      o.preventDefault();
      const _ = K(o);
      i.current = {
        id: _,
        last: { date: p, overflowIndex: null }
      }, Et(o.currentTarget, _), e(p);
    },
    movePointer: (o) => {
      if (!r(o)) return;
      o.preventDefault();
      const p = it(o);
      !p || i.current && Mt(i.current.last, p) || (i.current ? i.current.last = p : i.current = { id: K(o), last: p }, n(p));
    },
    finishPointer: (o, p) => {
      var D;
      if (!r(o)) return;
      o.preventDefault();
      const _ = it(o) ?? ((D = i.current) == null ? void 0 : D.last) ?? {
        date: p,
        overflowIndex: null
      };
      s(o), a(_);
    },
    cancelPointer: (o) => {
      r(o) && (s(o), c());
    }
  };
}, Ut = ({
  dates: t,
  visibleMonth: e,
  monthMotion: n,
  movingSelection: a,
  interactionActive: c,
  cycleDate: i,
  cyclePreview: r,
  selection: s,
  renderedSelection: o,
  config: p,
  onBegin: _,
  onEnter: D,
  onFinish: C,
  onCancel: M,
  onOverflowChange: k
}) => {
  const { labels: v, formatters: g, locale: u, classNames: d, getDayCellProps: y } = p, T = rt(), h = It({
    interactionActive: c,
    begin: _,
    enter: ({ date: l, overflowIndex: b }) => {
      k(b), D(l);
    },
    finish: ({ date: l }) => {
      k(null), C(l);
    },
    cancel: () => {
      k(null), M();
    }
  });
  return /* @__PURE__ */ f(
    "div",
    {
      className: x("quno-date-picker__grid", d == null ? void 0 : d.grid),
      "data-slot": "grid",
      "data-dragging": a ? "move" : void 0,
      "data-interaction-active": c ? "true" : void 0,
      "data-month-motion": n === -1 ? "previous" : n === 1 ? "next" : void 0,
      role: "grid",
      "aria-label": `${v.calendar}: ${g.month(
        e,
        u
      )}`,
      children: t.map((l, b) => {
        const w = pt(l, e), A = s ? F(l, s) : !1, E = o ? F(l, o) : !1, Z = (o == null ? void 0 : o.start) === l, O = (o == null ? void 0 : o.end) === l, Y = r ? F(l, r) : !1, tt = Y && (b % 7 === 0 || !r || !F(t[b - 1], r)), et = Y && (b % 7 === 6 || !r || !F(t[b + 1], r)), G = L(
          l
        ).getUTCDay(), U = y == null ? void 0 : y({
          date: l,
          weekday: G,
          isToday: l === T,
          isWeekend: G === 0 || G === 6,
          isOutside: !w,
          isSelected: E,
          isCommitted: A,
          isRangeStart: Z,
          isRangeEnd: O
        });
        return /* @__PURE__ */ W(
          "button",
          {
            type: "button",
            role: "gridcell",
            className: x(
              "quno-date-picker__day",
              {
                "quno-date-picker__day--outside": !w,
                "quno-date-picker__day--selected": E,
                "quno-date-picker__day--committed": A,
                "quno-date-picker__day--start": Z,
                "quno-date-picker__day--end": O
              },
              d == null ? void 0 : d.day,
              U == null ? void 0 : U.className
            ),
            style: U == null ? void 0 : U.style,
            title: U == null ? void 0 : U.title,
            "data-slot": "day",
            "data-date": l,
            "data-cycle-trigger": i === l ? "true" : void 0,
            "data-cycle-preview": Y ? "true" : void 0,
            "data-cycle-preview-start": tt ? "true" : void 0,
            "data-cycle-preview-end": et ? "true" : void 0,
            "data-cycle-preview-range-start": (r == null ? void 0 : r.start) === l ? "true" : void 0,
            "data-cycle-preview-range-end": (r == null ? void 0 : r.end) === l ? "true" : void 0,
            "data-range-start": Z ? "true" : void 0,
            "data-range-end": O ? "true" : void 0,
            "data-outside": w ? void 0 : "true",
            "data-selected": E ? "true" : void 0,
            "data-committed": A ? "true" : void 0,
            "aria-label": g.dayLabel(l, u),
            "aria-selected": A,
            onPointerDown: (j) => {
              k(null), h.beginPointer(j, l);
            },
            onPointerMove: h.movePointer,
            onPointerEnter: (j) => {
              j.pointerType !== "touch" && (k(null), D(l));
            },
            onPointerUp: (j) => h.finishPointer(j, l),
            onPointerCancel: h.cancelPointer,
            children: [
              /* @__PURE__ */ f("span", { children: Number(l.slice(-2)) }),
              (Z || O) && /* @__PURE__ */ f(
                "i",
                {
                  className: x(
                    "quno-date-picker__handle",
                    d == null ? void 0 : d.handle
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
  const { labels: c, formatters: i, locale: r, classNames: s } = n;
  return /* @__PURE__ */ W(
    "div",
    {
      className: x(
        "quno-date-picker__month-header",
        s == null ? void 0 : s.monthHeader
      ),
      "data-slot": "month-header",
      children: [
        /* @__PURE__ */ f(
          "button",
          {
            type: "button",
            className: s == null ? void 0 : s.previousButton,
            "data-slot": "previous-button",
            "aria-label": c.previousMonth,
            onClick: () => a(-1),
            children: /* @__PURE__ */ f(st, { direction: -1 })
          }
        ),
        /* @__PURE__ */ f(
          "h2",
          {
            className: s == null ? void 0 : s.monthHeading,
            "data-slot": "month-heading",
            "data-month-motion": e === -1 ? "previous" : e === 1 ? "next" : void 0,
            children: /* @__PURE__ */ f("span", { children: i.month(t, r) }, t)
          }
        ),
        /* @__PURE__ */ f(
          "button",
          {
            type: "button",
            className: s == null ? void 0 : s.nextButton,
            "data-slot": "next-button",
            "aria-label": c.nextMonth,
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
}, Rt = ({
  controller: t,
  config: e,
  touchOverflowIndex: n
}) => {
  const [a, c] = R({ type: "weekdays" }), { classNames: i, formatters: r, locale: s } = e, { interaction: o, renderedSelection: p, weekdays: _ } = t, D = o.type !== "idle", C = rt(), M = Array.from(
    { length: 7 },
    (g, u) => H(t.gridDates[0], u - 7)
  );
  X(() => {
    if (!D || n === null) {
      c({ type: "weekdays" });
      return;
    }
    c({ type: "previous-dates", pointerIndex: n });
  }, [D, n]);
  const k = (g) => {
    !D || g < 0 || (c({ type: "previous-dates", pointerIndex: g }), t.enterDay(M[g]));
  }, v = (g) => {
    c({ type: "weekdays" }), t.finishDrag(g);
  };
  return /* @__PURE__ */ f(
    "div",
    {
      className: x("quno-date-picker__weekdays", i == null ? void 0 : i.weekdays),
      "data-slot": "weekdays",
      "data-drag-overflow": a.type === "previous-dates" ? "previous" : void 0,
      "data-drag-active": D ? "true" : void 0,
      "aria-hidden": "true",
      onPointerEnter: (g) => {
        g.pointerType !== "touch" && k(dt(g.target, _));
      },
      onPointerLeave: () => c({ type: "weekdays" }),
      onPointerUp: (g) => {
        if (!D) return;
        const u = dt(g.target, _);
        u < 0 || (g.preventDefault(), v(M[u]));
      },
      children: _.map((g, u) => {
        var A;
        const d = M[u], y = p ? F(d, p) : !1;
        if (!(a.type === "previous-dates" && (y || u === a.pointerIndex)))
          return /* @__PURE__ */ f(
            "span",
            {
              className: i == null ? void 0 : i.weekday,
              "data-slot": "weekday",
              "data-day-index": g,
              "data-touch-date": d,
              "data-touch-index": u,
              onPointerEnter: (E) => {
                E.pointerType !== "touch" && k(u);
              },
              children: r.weekday(g, s)
            },
            g
          );
        const h = (p == null ? void 0 : p.start) === d, l = (p == null ? void 0 : p.end) === d, b = t.selection ? F(d, t.selection) : !1, w = (A = e.getDayCellProps) == null ? void 0 : A.call(e, {
          date: d,
          weekday: g,
          isToday: d === C,
          isWeekend: g === 0 || g === 6,
          isOutside: !0,
          isSelected: y,
          isCommitted: b,
          isRangeStart: h,
          isRangeEnd: l
        });
        return /* @__PURE__ */ f(
          "span",
          {
            className: x(
              "quno-date-picker__day",
              "quno-date-picker__day--outside",
              "quno-date-picker__overflow-day",
              y && "quno-date-picker__day--selected",
              h && "quno-date-picker__day--start",
              l && "quno-date-picker__day--end",
              i == null ? void 0 : i.day,
              i == null ? void 0 : i.overflowDay,
              w == null ? void 0 : w.className
            ),
            style: w == null ? void 0 : w.style,
            title: w == null ? void 0 : w.title,
            "data-slot": "overflow-day",
            "data-day-index": g,
            "data-date": d,
            "data-touch-date": d,
            "data-touch-index": u,
            "data-selected": y ? "true" : void 0,
            "data-range-start": h ? "true" : void 0,
            "data-range-end": l ? "true" : void 0,
            "data-outside": "true",
            onPointerEnter: (E) => {
              E.pointerType !== "touch" && k(u);
            },
            onPointerUp: (E) => {
              E.preventDefault(), E.stopPropagation(), v(d);
            },
            children: /* @__PURE__ */ f("span", { children: Number(d.slice(-2)) })
          },
          g
        );
      })
    }
  );
}, St = ({ controller: t, config: e }) => {
  const [n, a] = R(
    null
  ), { classNames: c } = e, i = t.interaction.type === "drag-range" || t.interaction.type === "drag-endpoint";
  return /* @__PURE__ */ W(
    "div",
    {
      className: x("quno-date-picker__calendar-shell", c == null ? void 0 : c.calendar),
      "data-slot": "calendar",
      "data-dragging": i ? "move" : void 0,
      children: [
        ["previous", "next"].map((r) => /* @__PURE__ */ f(
          "div",
          {
            className: x(
              "quno-date-picker__edge",
              `quno-date-picker__edge--${r}`,
              c == null ? void 0 : c.edge
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
          Rt,
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
            movingSelection: i,
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
}, $t = (t, e) => new Intl.DateTimeFormat(e, {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC"
}).format(/* @__PURE__ */ new Date(`${t}T00:00:00Z`)), Pt = (t, e) => new Intl.DateTimeFormat(e, {
  month: "long",
  year: "numeric",
  timeZone: "UTC"
}).format(/* @__PURE__ */ new Date(`${t}T00:00:00Z`)), Ft = (t, e) => new Intl.DateTimeFormat(e, {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC"
}).format(/* @__PURE__ */ new Date(`${t}T00:00:00Z`)), Lt = (t, e) => new Intl.DateTimeFormat(e, {
  weekday: "short",
  timeZone: "UTC"
}).format(new Date(Date.UTC(2026, 7, 2 + t))), jt = {
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
}, Bt = {
  date: $t,
  month: Pt,
  dayLabel: Ft,
  weekday: Lt
}, ct = ({
  selection: t,
  visibleMonth: e,
  position: n,
  monthChangeSource: a,
  config: c,
  onJump: i
}) => {
  const r = kt(
    () => t ? [
      { endpoint: "start", date: t.start },
      { endpoint: "end", date: t.end }
    ].filter(
      ({ date: u }) => nt(u, e) === n
    ) : [],
    [n, t, e]
  ), [s, o] = R(
    () => r.map((u) => ({
      ...u,
      phase: "entering",
      calendarReveal: "moving"
    }))
  ), p = Q(null), _ = Q(e);
  X(() => {
    const u = _.current !== e && a === "navigation" ? "stationary" : "moving";
    _.current = e, o((d) => {
      const y = d.map((h) => {
        const l = r.find(
          ({ endpoint: b }) => b === h.endpoint
        );
        return l ? {
          ...l,
          phase: h.phase === "exiting" ? "entering" : h.phase,
          calendarReveal: h.phase === "exiting" ? u : h.calendarReveal
        } : { ...h, phase: "exiting" };
      }), T = r.filter(
        ({ endpoint: h }) => !d.some((l) => l.endpoint === h)
      ).map((h) => ({
        ...h,
        phase: "entering",
        calendarReveal: u
      }));
      return [...y, ...T];
    });
  }, [r, a, e]);
  const D = s.map(({ endpoint: u, phase: d }) => `${u}:${d}`).join("|");
  if (X(() => {
    var y;
    const u = (y = p.current) == null ? void 0 : y.querySelector(
      '[data-item-presence="entering"], [data-item-presence="exiting"]'
    );
    if (!u) return;
    const d = window.getComputedStyle(u).animationName;
    (!d || d === "none") && o(
      (T) => T.flatMap(
        (h) => h.phase === "exiting" ? [] : [{ ...h, phase: "visible" }]
      )
    );
  }, [D]), !s.length) return null;
  const C = s.every(({ phase: u }) => u === "exiting") ? "exiting" : s.some(({ phase: u }) => u === "visible") ? "visible" : "entering", { labels: M, formatters: k, locale: v, classNames: g } = c;
  return /* @__PURE__ */ f(
    "div",
    {
      ref: p,
      className: x(
        "quno-date-picker__pills",
        `quno-date-picker__pills--${n}`,
        g == null ? void 0 : g.pills
      ),
      "data-slot": "pills",
      "data-position": n,
      "data-presence": C,
      "data-calendar-reveal": s.some(
        ({ phase: u, calendarReveal: d }) => u === "entering" && d === "stationary"
      ) ? "stationary" : void 0,
      "aria-hidden": C === "exiting" || void 0,
      children: /* @__PURE__ */ f("div", { className: "quno-date-picker__pills-track", children: s.map(({ endpoint: u, date: d, phase: y }) => /* @__PURE__ */ W(
        "button",
        {
          type: "button",
          className: x("quno-date-picker__pill", g == null ? void 0 : g.pill),
          "data-slot": "pill",
          "data-endpoint": u,
          "data-position": n,
          "data-item-presence": y,
          "aria-hidden": y === "exiting" || void 0,
          disabled: y === "exiting",
          onClick: () => i(d),
          onAnimationEnd: () => {
            o(
              (T) => T.flatMap((h) => h.endpoint !== u || h.phase !== y ? [h] : y === "entering" ? [{ ...h, phase: "visible" }] : [])
            );
          },
          children: [
            /* @__PURE__ */ f("span", { children: u === "start" ? M.start : M.end }),
            k.date(d, v),
            /* @__PURE__ */ f("span", { "aria-hidden": "true", children: n === "before" ? "↑" : "↓" })
          ]
        },
        u
      )) })
    }
  );
}, Wt = ({
  selection: t,
  config: e,
  onClear: n
}) => {
  const { labels: a, formatters: c, locale: i, classNames: r } = e, s = t ? t.start === t.end ? c.date(t.start, i) : `${c.date(t.start, i)} – ${c.date(
    t.end,
    i
  )}` : a.chooseDate;
  return /* @__PURE__ */ W(
    "header",
    {
      className: x(
        "quno-date-picker__selection-header",
        r == null ? void 0 : r.selectionHeader
      ),
      "data-slot": "selection-header",
      children: [
        /* @__PURE__ */ W("div", { children: [
          /* @__PURE__ */ f(
            "span",
            {
              className: x(
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
              children: s
            }
          )
        ] }),
        /* @__PURE__ */ f(
          "button",
          {
            type: "button",
            className: x("quno-date-picker__clear", r == null ? void 0 : r.clearButton),
            "data-slot": "clear-button",
            disabled: !t,
            onClick: n,
            children: a.clear
          }
        )
      ]
    }
  );
}, S = () => ({ type: "idle" }), Zt = (t, e, n) => ({
  type: "drag-endpoint",
  endpoint: e,
  origin: n,
  anchor: e === "start" ? t.end : t.start,
  current: t,
  moved: !1
}), Ht = (t, e) => {
  if (!t)
    return {
      type: "create",
      origin: e,
      current: { start: e, end: e },
      moved: !1
    };
  const n = e === t.start ? "start" : e === t.end ? "end" : null;
  return n ? Zt(t, n, e) : F(e, t) ? {
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
  endpoint: I(e, t.anchor) <= 0 ? "start" : "end",
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
}, Ot = (t, e) => {
  if (t.type === "idle")
    return { interaction: t };
  if (t.type === "paint-pending" && e !== t.origin)
    return {
      interaction: S(),
      value: J(t.origin, e)
    };
  if (t.moved) {
    const s = ft(t, e);
    return s.type === "idle" ? { interaction: s } : { interaction: S(), value: s.current };
  }
  if (t.type === "create")
    return { interaction: S(), value: { start: e, end: e } };
  const n = t.type === "paint-pending" ? t.original : t.current, a = wt(n, e), c = a.defaultAction === "start" ? "end" : "start", i = [
    a.defaultAction,
    c,
    "single"
  ], r = at({
    date: e,
    original: n,
    actions: i,
    index: -1,
    value: n
  });
  return {
    interaction: S(),
    value: r.changed ? r.value : void 0,
    cycle: r.cycle ?? void 0
  };
}, Yt = ({
  value: t,
  defaultValue: e,
  initialMonth: n,
  weekStartsOn: a,
  autoNavigateDelay: c,
  autoNavigateRepeatDelay: i,
  onChange: r,
  onVisibleMonthChange: s
}) => {
  const o = t !== void 0, [p, _] = R(e), D = o ? t ?? null : p, [C, M] = R(
    B(n ?? (D == null ? void 0 : D.start) ?? rt())
  ), [k, v] = R(null), [g, u] = R(null), [d, y] = R(S()), [T, h] = R(null), l = Q(null), b = () => {
    l.current !== null && (window.clearTimeout(l.current), l.current = null);
  };
  X(() => b, []);
  const w = (m) => {
    o || _(m), r == null || r(m);
  }, A = (m, q = null, $ = "interaction") => {
    v(q), u($), M(m), s == null || s(m);
  }, E = (m, q) => {
    v(m), u(q), M(($) => {
      const P = bt($, m);
      return s == null || s(P), P;
    }), h(null);
  }, Z = (m) => E(m, "navigation"), Y = (d.type === "idle" ? null : d.current) ?? D, tt = (T == null ? void 0 : T.date) ?? null, et = T ? at(T).value : null, G = (m) => {
    b(), y(Ht(D, m));
  }, U = (m) => {
    y((q) => ft(q, m));
  }, j = (m) => {
    if (b(), (T == null ? void 0 : T.date) === m && d.type !== "idle" && !d.moved) {
      const P = at(T);
      h(P.cycle), y(S()), P.changed && w(P.value);
      return;
    }
    const $ = Ot(d, m);
    if (y($.interaction), h($.cycle ?? null), $.value && w($.value), !pt(m, C)) {
      const P = I(m, C) < 0 ? -1 : 1;
      A(B(m), P, "interaction");
    }
  }, vt = () => {
    b(), y(S());
  }, yt = (m) => {
    if (d.type === "idle") return;
    b();
    const q = () => {
      E(m, "interaction"), l.current = window.setTimeout(q, i);
    };
    l.current = window.setTimeout(q, c);
  }, mt = () => {
    b(), y(S()), h(null), w(null);
  }, Dt = (m) => {
    b(), y(S()), h(null);
    const q = I(m, C) < 0 ? -1 : 1;
    A(B(m), q, "endpoint");
  };
  return {
    selection: D,
    renderedSelection: Y,
    cycleDate: tt,
    cyclePreview: et,
    visibleMonth: C,
    monthMotion: k,
    monthChangeSource: g,
    interaction: d,
    gridDates: xt(C, a),
    weekdays: Array.from({ length: 7 }, (m, q) => (a + q) % 7),
    beginDrag: G,
    enterDay: U,
    finishDrag: j,
    cancelDrag: vt,
    clear: mt,
    navigate: Z,
    startEdgeNavigation: yt,
    stopEdgeNavigation: b,
    jumpToEndpoint: Dt
  };
}, Kt = ({
  value: t,
  defaultValue: e = null,
  initialMonth: n,
  locale: a = "en-GB",
  labels: c,
  formatters: i,
  weekStartsOn: r = 1,
  className: s,
  classNames: o,
  getDayCellProps: p,
  autoNavigateDelay: _ = 400,
  autoNavigateRepeatDelay: D = 650,
  onChange: C,
  onVisibleMonthChange: M
}) => {
  const k = {
    locale: a,
    labels: { ...jt, ...c },
    formatters: { ...Bt, ...i },
    classNames: o,
    getDayCellProps: p
  }, v = Yt({
    value: t,
    defaultValue: e,
    initialMonth: n,
    weekStartsOn: r,
    autoNavigateDelay: _,
    autoNavigateRepeatDelay: D,
    onChange: C,
    onVisibleMonthChange: M
  }), g = v.selection ? [
    nt(v.selection.start, v.visibleMonth),
    nt(v.selection.end, v.visibleMonth)
  ] : [];
  return /* @__PURE__ */ W(
    "section",
    {
      className: x("quno-date-picker", s, o == null ? void 0 : o.root),
      "data-slot": "root",
      "data-pill-before": g.includes("before") || void 0,
      "data-pill-after": g.includes("after") || void 0,
      "aria-label": k.labels.calendar,
      onPointerUp: v.stopEdgeNavigation,
      children: [
        /* @__PURE__ */ f(
          Wt,
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
        /* @__PURE__ */ f(St, { controller: v, config: k }),
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
            className: x("quno-date-picker__hint", o == null ? void 0 : o.hint),
            "data-slot": "hint",
            children: k.labels.hint
          }
        )
      ]
    }
  );
};
export {
  Kt as QunoDatePicker,
  H as addDays,
  bt as addMonths,
  Tt as applyDateAction,
  xt as calendarGrid,
  I as compareDates,
  wt as dateActionContext,
  V as differenceInDays,
  ht as editEndpoint,
  pt as isInMonth,
  F as isWithinRange,
  nt as monthRelation,
  Ct as moveRange,
  gt as nearestEndpoint,
  J as normalizeRange,
  zt as selectDate,
  B as startOfMonth
};
