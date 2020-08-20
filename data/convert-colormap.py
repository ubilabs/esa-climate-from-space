from matplotlib import cm

stepsNum = 10
minValue = 0
maxValue = 6
cmap = cm.get_cmap('Blues')
reverse = True

r = range(0, stepsNum + 1)

diff = (maxValue - minValue) / stepsNum
steps = [n / stepsNum for n in r]
values = [round(minValue + diff * n, 1) for n in r]

if reverse:
  values.reverse()

for s, v in zip(steps, values):
  r,g,b,a = cmap(s)
  print(v, int(r * 255), int(g * 255), int(b * 255), int(a * 255))

